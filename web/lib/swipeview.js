/*!
 * SwipeView v1.0 ~ Copyright (c) 2012 Matteo Spinelli, http://cubiq.org
 * Released under MIT license, http://cubiq.org/license
 */
var SwipeView = (function () {
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

	function clamp(n, min, max) {
		return Math.max(min, Math.min(max, n));
	}

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
	var transform = prefixStyle('transform');
	var transitionDuration = prefixStyle('transitionDuration');

	function SwipeView (wrapper) {
		var self = this;
		var slider;
		var len = 0;
		var masters = self.masters = [];
		var activeMaster = 0;
		var xPos = 0;
		var minX = 0;
		var page = 0;
		var snapThreshold = 0;
		var inputhandler = new InputHandler(vendor);

		function init () {
			wrapper.style.overflow = 'hidden';
			wrapper.style.postition = 'relative';

			slider = document.createElement('div');
			var s = slider.style;
			s.position = 'relative';
			s.top = '0';
			s.height = '100%';
			s.width = '100%';
			s[cssVendor + 'transition-timing-function'] = 'ease-out';
			wrapper.appendChild(slider);

			self.refreshSize();

			for (var i = -1; i < 2; i++) {
				var page = document.createElement('div');
				var s = page.style;
				s.position = 'absolute';
				s.top = '0';
				s.height = '100%';
				s.width = '100%';
				s.left = i * 100 + '%';
				s.overflow = 'hidden';

				page.dataset = {};

				slider.appendChild(page);
				masters.push(page);
			}

			inputhandler.attach(wrapper, slider);
			inputhandler.on('start', onStart);
			inputhandler.on('resize', bind(self, 'refreshSize'));
			dispatcher.on('destroy', function () {
				inputhandler.detach();
			});
		}

		var dispatcher = new Dispatcher();
		self.on = dispatcher.on;
		self.off = dispatcher.off;

		self.refreshSize = function () {
			pageWidth = wrapper.clientWidth;
			minX = (1 - len) * pageWidth;
			snapThreshold = Math.round(pageWidth * 0.15);
			slider.style[transitionDuration] = '0s';
			setPos(-page * pageWidth);
		}

		self.setLen = function (n) {
			len = n;
			self.refreshSize();
		}

		self.page = function () {
			return page;
		}

		self.setPage = function (p) {
			function positionMasters(a, b, c) {
				var m = masters;
				var sa = m[a].style;
				var sb = m[b].style;
				var sc = m[c].style;

				sa.left = (page - 1) * 100 + '%';
				if (page === 0) sa.visibility = 'hidden';
				else sa.visibility = 'visible';

				sb.left = page * 100 + '%';
				sb.visibility = 'visible';

				sc.left = (page + 1) * 100 + '%';
				if (page === len - 1) sc.visibility = 'hidden';
				else sc.visibility = 'visible';

				m[a].dataset.upcomingPageIndex = page === 0 ? len - 1 : page - 1;
				m[b].dataset.upcomingPageIndex = page;
				m[c].dataset.upcomingPageIndex = page === len - 1 ? 0 : page + 1;
			}
			page = clamp(p, 0, len - 1);
			slider.style[transitionDuration] = '0s';
			setPos(-page * pageWidth);

			activeMaster = mod(page + 1, 3);

			if (activeMaster === 0) {
				positionMasters(2, 0, 1);
			} else if (activeMaster == 1) {
				positionMasters(0, 1, 2);
			} else {
				positionMasters(1, 2, 0);
			}

			dispatcher.fire('flip');

			for (var i = 0; i < 3; i++) {
				masters[i].dataset.pageIndex = masters[i].dataset.upcomingPageIndex;
			}
		}

		var loadingElm;
		self.setLoading = function (newLoadingElm) {
			loadingElm = newLoadingElm;
		}

		self.destroy = function () {
			dispatcher.fire('destroy');
		}

		function setPos (x) {
			xPos = x;
			// translateZ(0) does not affect our appearance, but hints to the
			// renderer that it should hardware accelerate us, and thus makes
			// things much faster and smoother (usually). For reference, see:
			//     http://www.html5rocks.com/en/tutorials/speed/html5/
			slider.style[transform] = 'translateX(' + x + 'px) translateZ(0)';
		}

		function onStart (e, point) {
			var startX = point.pageX;
			var startY = point.pageY;
			var prevX = startX;
			var prevY = startY;
			var directionLocked = false;

			slider.style[transitionDuration] = '0s';

			inputhandler.on('move', onMove);

			function onMove (e, point) {
				var dx = point.pageX - prevX;
				prevX = point.pageX;
				prevY = point.pageY;

				var newX = xPos + dx;
				if (newX > 0 || newX < minX) {
					newX = xPos + (dx / 2);
				}

				var absX = Math.abs(prevX - startX);
				var absY = Math.abs(prevY - startY);

				// We take a 10px buffer to figure out the direction of the swipe
				if (absX < 10 && absY < 10) {
					return;
				}

				// We are scrolling vertically, so skip SwipeView and give the control back to the browser
				if (absY > absX && !directionLocked) {
					inputhandler.off('move');
					directionLocked = true;
					return;
				}

				e.preventDefault();
				inputhandler.off('end').on('end', onEnd);
				inputhandler.off('transitionEnd').on('transitionEnd', onTransitionEnd);
				setPos(newX);
			}

			function onEnd (e, point) {
				inputhandler.off('move');
				inputhandler.off('end');

				prevX = point.pageX;
				var deltaX = prevX - startX;
				var dist = Math.abs(deltaX);

				if (xPos > 0 || xPos < minX) dist *= 0.15;

				if (dist < snapThreshold) {
					var time = Math.floor(300 * dist / snapThreshold) + 'ms';
					slider.style[transitionDuration] = time;
					setPos(-page * pageWidth);
					return;
				}

				if (deltaX > 0) {
					page = Math.floor(-xPos / pageWidth);
				} else {
					page = Math.ceil(-xPos / pageWidth);
				}

				newX = -page * pageWidth;

				slider.style[transitionDuration] = Math.floor(500 * Math.abs(xPos - newX) / pageWidth) + 'ms';

				setPos(newX);
			}

			function onTransitionEnd (e) {
				self.setPage(page);
			}
		}
		init();
	};

	function prefixStyle (style) {
		if (vendor === '') return style;

		style = style.charAt(0).toUpperCase() + style.substr(1);
		return vendor + style;
	}

	return SwipeView;
})();
