/*!
 * SwipeView v1.0 ~ Copyright (c) 2012 Matteo Spinelli, http://cubiq.org
 * Released under MIT license, http://cubiq.org/license
 */
function InputHandler (vendor) {
	var self = this;
	var hasTouch = 'ontouchstart' in window;
	var resizeEvent = 'onorientationchange' in window ? 'orientationchange' : 'resize';
	var startEvent = hasTouch ? 'touchstart' : 'mousedown';
	var moveEvent = hasTouch ? 'touchmove' : 'mousemove';
	var endEvent = hasTouch ? 'touchend' : 'mouseup';
	var cancelEvent = hasTouch ? 'touchcancel' : 'mouseup';
	var transitionEndEvent = (function () {
		if ( vendor === false ) return false;

		var transitionEnd = {
			''			: 'transitionend',
			'webkit'	: 'webkitTransitionEnd',
			'Moz'		: 'transitionend',
			'O'			: 'oTransitionEnd',
			'ms'		: 'MSTransitionEnd'
		};

		return transitionEnd[vendor];
	})();

	function handleEvent (e) {
		var t = e.type;
		if (t == startEvent) dispatcher.fire('start', e, hasTouch ? e.touches[0] : e);
		else if (t == moveEvent) dispatcher.fire('move', e, hasTouch ? e.touches[0] : e);
		else if (t == cancelEvent) dispatcher.fire('end', e, hasTouch ? e.changedTouches[0] : e);
		else if (t == endEvent) dispatcher.fire('end', e, hasTouch ? e.changedTouches[0] : e);
		else if (t == resizeEvent) dispatcher.fire('resize', e);
		else if (t == transitionEndEvent) dispatcher.fire('transitionEnd', e);
	}

	var dispatcher = new Dispatcher();
	this.on = dispatcher.on;
	this.off = dispatcher.off;

	var wrapper;
	var slider;
	this.attach = function (newWrapper, newSlider) {
		if (wrapper || slider) this.detach();
		wrapper = newWrapper;
		slider = newSlider;
		window.addEventListener(resizeEvent, handleEvent, false);
		wrapper.addEventListener(startEvent, handleEvent, false);
		wrapper.addEventListener(moveEvent, handleEvent, false);
		wrapper.addEventListener(endEvent, handleEvent, false);
		slider.addEventListener(transitionEndEvent, handleEvent, false);
		return this;
	}

	this.detach = function () {
		window.removeEventListener(resizeEvent, handleEvent, false);
		wrapper.removeEventListener(startEvent, handleEvent, false);
		wrapper.removeEventListener(moveEvent, handleEvent, false);
		wrapper.removeEventListener(endEvent, handleEvent, false);
		slider.removeEventListener(transitionEndEvent, handleEvent, false);
		return this;
	}
}

// From http://fitzgeraldnick.com/weblog/26/ with slight modifications
function bind(thisCtx, name /*, variadic args to curry */) {
	var args = Array.prototype.slice.call(arguments, 2);
	return function () {
		return thisCtx[name].apply(thisCtx, args.concat(Array.prototype.slice.call(arguments)));
	};
}

var SwipeView = (function ($) {
	var dummyStyle = document.createElement('div').style;
	var vendor = (function () {
		var vendors = 't,webkitT,MozT,msT,OT'.split(',');
		var l = vendors.length;

		for (var i = 0 ; i < l; i++) {
			var t = vendors[i] + 'ransform';
			if (t in dummyStyle) {
				return vendors[i].substr(0, vendors[i].length - 1);
			}
		}

		return false;
	})();
	var cssVendor = vendor ? '-' + vendor.toLowerCase() + '-' : '';

	function addClass(el, classy) {
		$(el).addClass(classy);
	}

	function removeClass(el, classy) {
		$(el).removeClass(classy);
	}

		// Style properties
	var transform = prefixStyle('transform'),
		transitionDuration = prefixStyle('transitionDuration'),

		// Browser capabilities
		has3d = prefixStyle('perspective') in dummyStyle,
		hasTransform = !!vendor,
		hasTransitionEnd = prefixStyle('transition') in dummyStyle,

		// Helpers
		translateZ = has3d ? ' translateZ(0)' : '',

		SwipeView = function (el, options) {
			var i,
				div,
				className,
				pageIndex;

			this.wrapper = typeof el == 'string' ? document.querySelector(el) : el;
			this.options = {
				text: null,
				numberOfPages: 3,
				snapThreshold: null,
				hastyPageFlip: false,
				loop: true
			};

			// User defined options
			for (i in options) this.options[i] = options[i];

			this.wrapper.style.overflow = 'hidden';
			this.wrapper.style.position = 'relative';

			this.masterPages = [];

			div = document.createElement('div');
			div.id = 'swipeview-slider';
			div.style.cssText = 'position:relative;top:0;height:100%;width:100%;' + cssVendor + 'transition-duration:0;' + cssVendor + 'transform:translateZ(0);' + cssVendor + 'transition-timing-function:ease-out';
			this.wrapper.appendChild(div);
			this.slider = div;

			this.refreshSize();

			for (i = -1; i < 2; i++) {
				div = document.createElement('div');
				div.id = 'swipeview-masterpage-' + (i+1);
				div.style.cssText = cssVendor + 'transform:translateZ(0);position:absolute;top:0;height:100%;width:100%;left:' + i*100 + '%';
				if (!div.dataset) div.dataset = {};
				pageIndex = i == -1 ? this.options.numberOfPages - 1 : i;
				div.dataset.pageIndex = pageIndex;
				div.dataset.upcomingPageIndex = pageIndex;

				if (!this.options.loop && i == -1) div.style.visibility = 'hidden';

				this.slider.appendChild(div);
				this.masterPages.push(div);
			}

			addClass(this.masterPages[1], 'swipeview-active');

			this.inputhandler = new InputHandler(vendor);
			this.inputhandler.attach(this.wrapper, this.slider);
			this.inputhandler.on('start', bind(this, '__start'));
			this.inputhandler.on('move', bind(this, '__move'));
			this.inputhandler.on('end', bind(this, '__end'));
			this.inputhandler.on('resize', bind(this, '__resize'));
			this.inputhandler.on('transitionEnd', bind(this, '__transitionEnd'));

			this.dispatcher = new Dispatcher();
			this.on = this.dispatcher.on;
			this.off = this.dispatcher.off;
		};

	SwipeView.prototype = {
		currentMasterPage: 1,
		x: 0,
		page: 0,
		pageIndex: 0,
		customEvents: [],

		destroy: function () {
			this.inputhandler.destroy();
		},

		refreshSize: function () {
			this.wrapperWidth = this.wrapper.clientWidth;
			this.wrapperHeight = this.wrapper.clientHeight;
			this.pageWidth = this.wrapperWidth;
			this.maxX = -this.options.numberOfPages * this.pageWidth + this.wrapperWidth;
			this.snapThreshold = this.options.snapThreshold === null ?
				Math.round(this.pageWidth * 0.15) :
				/%/.test(this.options.snapThreshold) ?
					Math.round(this.pageWidth * this.options.snapThreshold.replace('%', '') / 100) :
					this.options.snapThreshold;
		},

		updatePageCount: function (n) {
			this.options.numberOfPages = n;
			this.maxX = -this.options.numberOfPages * this.pageWidth + this.wrapperWidth;
		},

		goToPage: function (p) {
			var that = this;
			var n = this.options.numberOfPages;
			function positionPage(a, b, c) {
				var m = that.masterPages;
				m[a].style.left = p * 100 - 100 + '%';
				m[b].style.left = p * 100 + '%';
				m[c].style.left = p * 100 + 100 + '%';

				m[a].dataset.upcomingPageIndex = p === 0 ? n - 1 : p - 1;
				m[b].dataset.upcomingPageIndex = p;
				m[c].dataset.upcomingPageIndex = p === n - 1 ? 0 : p + 1;
			}
			p = p < 0 ? 0 : p > n - 1 ? n - 1 : p;
			this.page = p;
			this.pageIndex = p;
			this.slider.style[transitionDuration] = '0s';
			this.__pos(-p * this.pageWidth);

			this.currentMasterPage = (this.page + 1) - Math.floor((this.page + 1) / 3) * 3;

			if (this.currentMasterPage === 0) {
				positionPage(2, 0, 1);
			} else if (this.currentMasterPage == 1) {
				positionPage(0, 1, 2);
			} else {
				positionPage(1, 2, 0);
			}

			this.__flip();
		},

		next: function () {
			if (!this.options.loop && this.x == this.maxX) return;

			this.directionX = -1;
			this.x -= 1;
			this.__checkPosition();
		},

		prev: function () {
			if (!this.options.loop && this.x === 0) return;

			this.directionX = 1;
			this.x += 1;
			this.__checkPosition();
		},


		/**
		*
		* Pseudo private methods
		*
		*/
		__pos: function (x) {
			this.x = x;
			this.slider.style[transform] = 'translate(' + x + 'px,0)' + translateZ;
		},

		__resize: function () {
			this.refreshSize();
			this.slider.style[transitionDuration] = '0s';
			this.__pos(-this.page * this.pageWidth);
		},

		__start: function (e, point) {
			if (this.initiated) return;

			this.initiated = true;
			this.moved = false;
			this.thresholdExceeded = false;
			this.startX = point.pageX;
			this.startY = point.pageY;
			this.pointX = point.pageX;
			this.pointY = point.pageY;
			this.stepsX = 0;
			this.stepsY = 0;
			this.directionX = 0;
			this.directionLocked = false;

			this.slider.style[transitionDuration] = '0s';
		},

		__move: function (e, point) {
			if (!this.initiated) return;

			var deltaX = point.pageX - this.pointX,
				deltaY = point.pageY - this.pointY,
				newX = this.x + deltaX,
				dist = Math.abs(point.pageX - this.startX);

			this.moved = true;
			this.pointX = point.pageX;
			this.pointY = point.pageY;
			this.directionX = deltaX > 0 ? 1 : deltaX < 0 ? -1 : 0;
			this.stepsX += Math.abs(deltaX);
			this.stepsY += Math.abs(deltaY);

			// We take a 10px buffer to figure out the direction of the swipe
			if (this.stepsX < 10 && this.stepsY < 10) {
				return;
			}

			// We are scrolling vertically, so skip SwipeView and give the control back to the browser
			if (!this.directionLocked && this.stepsY > this.stepsX) {
				this.initiated = false;
				return;
			}

			e.preventDefault();

			this.directionLocked = true;

			if (!this.options.loop && (newX > 0 || newX < this.maxX)) {
				newX = this.x + (deltaX / 2);
			}

			if (!this.thresholdExceeded && dist >= this.snapThreshold) {
				this.thresholdExceeded = true;
			} else if (this.thresholdExceeded && dist < this.snapThreshold) {
				this.thresholdExceeded = false;
			}

			this.__pos(newX);
		},

		__end: function (e, point) {
			if (!this.initiated) return;

			var dist = Math.abs(point.pageX - this.startX);

			this.initiated = false;

			if (!this.moved) return;

			var realDist = dist;
			if (!this.options.loop && (this.x > 0 || this.x < this.maxX)) {
				dist = 0;
				realDist /= 3;
			}

			// Check if we exceeded the snap threshold
			if (dist < this.snapThreshold) {
				var val = Math.floor(300 * realDist / this.snapThreshold) + 'ms';
				console.log(val);
				this.slider.style[transitionDuration] = val;//'300ms';//
				this.__pos(-this.page * this.pageWidth);
				return;
			}

			this.__checkPosition();
		},

		__checkPosition: function () {
			var pageFlip,
				pageFlipIndex,
				className;

			removeClass(this.masterPages[this.currentMasterPage], 'swipeview-active');
			// Flip the page
			if (this.directionX > 0) {
				this.page = -Math.ceil(this.x / this.pageWidth);
				this.currentMasterPage = (this.page + 1) - Math.floor((this.page + 1) / 3) * 3;
				this.pageIndex = this.pageIndex === 0 ? this.options.numberOfPages - 1 : this.pageIndex - 1;

				pageFlip = this.currentMasterPage - 1;
				pageFlip = pageFlip < 0 ? 2 : pageFlip;
				this.masterPages[pageFlip].style.left = this.page * 100 - 100 + '%';

				pageFlipIndex = this.page - 1;
			} else {
				this.page = -Math.floor(this.x / this.pageWidth);
				this.currentMasterPage = (this.page + 1) - Math.floor((this.page + 1) / 3) * 3;
				this.pageIndex = this.pageIndex == this.options.numberOfPages - 1 ? 0 : this.pageIndex + 1;

				pageFlip = this.currentMasterPage + 1;
				pageFlip = pageFlip > 2 ? 0 : pageFlip;
				this.masterPages[pageFlip].style.left = this.page * 100 + 100 + '%';

				pageFlipIndex = this.page + 1;
			}

			addClass(this.masterPages[this.currentMasterPage], 'swipview-active');
			addClass(this.masterPages[pageFlip], 'swipeview-loading');

			pageFlipIndex = pageFlipIndex - Math.floor(pageFlipIndex / this.options.numberOfPages) * this.options.numberOfPages;
			this.masterPages[pageFlip].dataset.upcomingPageIndex = pageFlipIndex;		// Index to be loaded in the newly flipped page

			newX = -this.page * this.pageWidth;

			this.slider.style[transitionDuration] = Math.floor(500 * Math.abs(this.x - newX) / this.pageWidth) + 'ms';

			// Hide the next page if we decided to disable looping
			if (!this.options.loop) {
				this.masterPages[pageFlip].style.visibility = newX === 0 || newX == this.maxX ? 'hidden' : '';
			}

			this.__pos(newX);
			if (this.options.hastyPageFlip) this.__flip();
		},

		__flip: function () {
			this.dispatcher.fire('flip');

			for (var i = 0; i < 3; i++) {
				if (this.masterPages[i]) {
					removeClass(this.masterPages[i], 'swipeview-loading');
					this.masterPages[i].dataset.pageIndex = this.masterPages[i].dataset.upcomingPageIndex;
				} else {
					debugger;
				}
			}
		},

		__transitionEnd: function (e) {
			if (e.target && this.slider && !this.options.hastyPageFlip) this.__flip();
		}
	};

	function prefixStyle (style) {
		if ( vendor === '' ) return style;

		style = style.charAt(0).toUpperCase() + style.substr(1);
		return vendor + style;
	}

	return SwipeView;
})(Zepto);
