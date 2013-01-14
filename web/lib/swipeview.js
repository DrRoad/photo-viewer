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

// Mod in javascript is messed up for negative numbers.
function mod(a, b) {
	return ((a % b) + b) % b;
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

		SwipeView = function (el, options) {
			var i;
			var className;
			var pageIndex;

			this.wrapper = el;
			this.wrapper.style.overflow = 'hidden';
			this.wrapper.style.postition = 'relative';
			this.options = {
				text: null,
				numberOfPages: 3,
				snapThreshold: null,
				hastyPageFlip: false,
				loop: false,
			};

			this.masterPages = [];

			this.slider = document.createElement('div');
			var s = this.slider.style;
			s.position = 'relative';
			s.top = '0';
			s.height = '100%';
			s.width = '100%';
			s[cssVendor + 'transition-timing-function'] = 'ease-out';
			this.wrapper.appendChild(this.slider);

			this.refreshSize();

			for (var i = -1; i < 2; i++) {
				var page = document.createElement('div');
				var s = page.style;
				s.position = 'absolute';
				s.top = '0';
				s.height = '100%';
				s.width = '100%';
				s.left = i * 100 + '%';
				if (i == -1) s.visibility = 'hidden';

				page.dataset = {};
				var pageIndex = i == -1 ? this.options.numberOfPages - 1 : i;
				page.dataset.pageIndex = pageIndex;
				page.dataset.upcomingPageIndex = pageIndex;

				this.slider.appendChild(page);
				this.masterPages.push(page);
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
			self = this;

			this.currentMasterPage = 0;
			this.x = 0;
			this.page = 0;
			this.pageIndex = 0;
		};
	// Only allows one instance to properly exist, at least until I refactor things properly.
	var self;
	function deltaX () {
		return self.pointX - self.startX;
	}
	function deltaY () {
		return self.pointY - self.startY;
	}

	SwipeView.prototype = {
		destroy: function () {
			this.inputhandler.detach();
		},

		refreshSize: function () {
			this.wrapperWidth = this.wrapper.clientWidth;
			this.wrapperHeight = this.wrapper.clientHeight;
			this.pageWidth = this.wrapperWidth;
			this.maxX = -this.options.numberOfPages * this.pageWidth + this.wrapperWidth;
			this.snapThreshold = Math.round(this.pageWidth * 0.15);
		},

		updatePageCount: function (n) {
			this.options.numberOfPages = n;
			this.maxX = -this.options.numberOfPages * this.pageWidth + this.wrapperWidth;
		},

		goToPage: function (p) {
			var self = this;
			var n = this.options.numberOfPages;
			function positionPage(a, b, c) {
				var m = self.masterPages;
				m[a].style.left = (p - 1) * 100 + '%';
				m[b].style.left = p * 100 + '%';
				m[c].style.left = (p + 1) * 100 + '%';

				m[a].dataset.upcomingPageIndex = p === 0 ? n - 1 : p - 1;
				m[b].dataset.upcomingPageIndex = p;
				m[c].dataset.upcomingPageIndex = p === n - 1 ? 0 : p + 1;
			}
			p = p < 0 ? 0 : p > n - 1 ? n - 1 : p;
			this.page = p;
			this.pageIndex = p;
			this.slider.style[transitionDuration] = '0s';
			this.__pos(-p * this.pageWidth);

			this.currentMasterPage = mod(this.page + 1, 3);

			if (this.currentMasterPage === 0) {
				positionPage(2, 0, 1);
			} else if (this.currentMasterPage == 1) {
				positionPage(0, 1, 2);
			} else {
				positionPage(1, 2, 0);
			}

			this.__flip();
		},

		/**
		*
		* Pseudo private methods
		*
		*/
		__pos: function (x) {
			this.x = x;
			this.slider.style[transform] = 'translate(' + x + 'px,0)';
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
			this.directionLocked = false;

			this.slider.style[transitionDuration] = '0s';
		},

		__move: function (e, point) {
			if (!this.initiated) return;

			var dx = point.pageX - this.pointX;
			var newX = this.x + dx;
			if (newX > 0 || newX < this.maxX) {
				newX = this.x + (dx / 2);
			}

			this.moved = true;
			this.pointX = point.pageX;
			this.pointY = point.pageY;
			var absX = Math.abs(deltaX());
			var absY = Math.abs(deltaY());

			// We take a 10px buffer to figure out the direction of the swipe
			if (absX < 10 && absY < 10) {
				return;
			}

			// We are scrolling vertically, so skip SwipeView and give the control back to the browser
			if (!this.directionLocked && absY > absX) {
				this.initiated = false;
				return;
			}

			e.preventDefault();

			this.directionLocked = true;

			if (absX >= this.snapThreshold) {
				this.thresholdExceeded = true;
			} else {
				this.thresholdExceeded = false;
			}

			this.__pos(newX);
		},

		__end: function (e, point) {
			if (!this.initiated) return;

			this.pointX = point.pageX;
			var dist = Math.abs(deltaX());

			this.initiated = false;

			if (!this.moved) return;

			var realDist = dist;
			if (this.x > 0 || this.x < this.maxX) {
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
			var pageFlip;
			var pageFlipIndex;
			var className;

			removeClass(this.masterPages[this.currentMasterPage], 'swipeview-active');

			if (deltaX() > 0) {
				this.page = -Math.ceil(this.x / this.pageWidth);
				this.currentMasterPage = mod(this.page + 1, 3);
				this.pageIndex = this.pageIndex === 0 ? this.options.numberOfPages - 1 : this.pageIndex - 1;

				pageFlip = this.currentMasterPage - 1;
				pageFlip = pageFlip < 0 ? 2 : pageFlip;
				this.masterPages[pageFlip].style.left = this.page * 100 - 100 + '%';

				pageFlipIndex = this.page - 1;
			} else {
				this.page = -Math.floor(this.x / this.pageWidth);
				this.currentMasterPage = mod(this.page + 1, 3);
				this.pageIndex = this.pageIndex == this.options.numberOfPages - 1 ? 0 : this.pageIndex + 1;

				pageFlip = this.currentMasterPage + 1;
				pageFlip = pageFlip > 2 ? 0 : pageFlip;
				this.masterPages[pageFlip].style.left = this.page * 100 + 100 + '%';

				pageFlipIndex = this.page + 1;
			}

			addClass(this.masterPages[this.currentMasterPage], 'swipview-active');
			addClass(this.masterPages[pageFlip], 'swipeview-loading');

			pageFlipIndex = mod(pageFlipIndex, this.options.numberOfPages);

			// Index to be loaded in the newly flipped page
			this.masterPages[pageFlip].dataset.upcomingPageIndex = pageFlipIndex;

			newX = -this.page * this.pageWidth;

			this.slider.style[transitionDuration] = Math.floor(500 * Math.abs(this.x - newX) / this.pageWidth) + 'ms';

			// Hide the next page if we decided to disable looping
			if (!this.options.loop) {
				this.masterPages[pageFlip].style.visibility = newX === 0 || newX == this.maxX ? 'hidden' : '';
			}

			this.__pos(newX);
		},

		__flip: function () {
			this.dispatcher.fire('flip');

			for (var i = 0; i < 3; i++) {
				removeClass(this.masterPages[i], 'swipeview-loading');
				this.masterPages[i].dataset.pageIndex = this.masterPages[i].dataset.upcomingPageIndex;
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
