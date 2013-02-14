var PhotoViewer = (function (Zepto, jQuery, App) {
	function TranformStacker(elm) {
		var self = this;
		var x = 0;
		var y = 0;
		var scale = 1;

		var ax = 0;
		var ay = 0;
		var ascale = 1;
		var astart = 0;
		var at = 0;

		function reapply() {
			var s = elm.style;
			var transform = 'translate3d(' + round(x * scale, 2) + 'px,' + round(y * scale, 2) + 'px,0px) scale(' + round(scale, 2) + ',' + round(scale, 2) + ') ';
			s.webkitTransform = '';
			s.webkitTransition = 'transform 0ms';

		}

		self.addTranslate = function (dx, dy, t) {
			if (t === 0 || t === undefined) {
				x += dx;
				y += dy;
				reapply();
			} else {

			}
		}
		// t: Time, [0...d]
		// b: Start value
		// c: Change in value
		// d: Total duration
		function easeInOutCubic(t, b, c, d) {
			t /= d/2;
			if (t < 1) return c/2*t*t*t + b;
			t -= 2;
			return c/2*(t*t*t + 2) + b;
		};
	}
	function Zoomable(viewport, element, parent) {
		var self = this;
		var use3dAcceleration = true;
		self.disable3d = function () {
			use3dAcceleration = false;
			setTransform();
		}
		var x = 0;
		var y = 0;
		var scale = 1;
		setTransform();
		function dist(p1, p2) {
			p1 = p1.x ? p1 : p1.lastPoint;
			p2 = p2.x ? p2 : p2.lastPoint;
			return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
		}
		function center(p1, p2) {
			return {
				x: (p1.x + p2.x) / 2,
				y: (p1.y + p2.y) / 2,
			};
		}
		function abs(n) {
			return Math.abs(n);
		}
		function roundObj(o) {
			var newO = {};
			for (k in o) {
				if (typeof o[k] == 'number') {
					newO[k] = round(o[k], 2);
				} else {
					newO[k] = o[k];
				}
			}
			return JSON.stringify(newO) + ' ';

		}
		function setTransform() {
			var r = round;
			var tx = r(x * scale, 2);
			var ty = r(y * scale, 2);
			var ts = r(scale, 2);
			var t = '';
			t = 'translateX(' + tx + 'px) translateY(' + ty + 'px) scale(' + ts + ',' + ts + ')';
			element.style.webkitTransform = t;
		}
		function dur(t) {
			element.style.webkitTransitionProperty = t === 0 ? 'none' : 'all';
			element.style.webkitTransitionDuration = round(t, 2) + 'ms';
		}
		function viewHalfX() {
			return viewport.offsetWidth / 2;
		}
		function viewHalfY() {
			return viewport.offsetHeight / 2;
		}
		function findMaxX() {
			var maxX = element.offsetWidth / 2 - viewHalfX() / scale + 2;
			if (maxX < 0) return 0;
			else return maxX;
		}
		function findMaxY() {
			var maxY = element.offsetHeight / 2 - viewHalfY() / scale + 2;
			if (maxY < 0) return 0;
			else return maxY;
		}
		function boundXandY() {
			var maxX = findMaxX();
			if (Math.abs(x) > maxX) {
				x = x > 0 ? maxX : -maxX;
			}
			var maxY = findMaxY();
			if (Math.abs(y) > maxY) {
				y = y > 0 ? maxY : -maxY;
			}
		}
		// Converts an abitrary point in screen
		// coordinates to the corresponding point
		// in image coordinates, given the transforms
		// and scaling currently in place.
		//
		//    screen coordinates        image coordinates
		//      +--------(+viewW)            (+maxY)
		//      |                               |
		//      |                   (+maxX)-----+------(-maxX)
		//      |                               |
		//    (+viewH)                       (-maxY)
		//
		// Notice X and Y are flipped, and the origin
		// has moved from the top-left corner to the
		// center.
		function sc2ic(sc) {
			return {
				x: x + (viewHalfX() - sc.x) / scale,
				y: y + (viewHalfY() - sc.y) / scale,
			}
		}
		parent.on('flip', function (page) {
			if (page === prevPage) return;

			prevPage = page;
			x = 0;
			y = 0;
			scale = 1;
			dur(0);
			setTransform();
		});
		var prevPage = -1;
		var prevTouchEnd = 0;
		Touchy(viewport, {
		one: function (hand, finger) {
			var prevX = finger.lastPoint.x;
			var prevY = finger.lastPoint.y;

			var maxX = findMaxX();
			if (Math.abs(x) >= maxX) {
				parent.enable();
			}
			boundXandY();

			finger.on('move', function (point) {
				prevTouchEnd = 0;
				if (scale <= 1) return;

				var dx = (point.x - prevX) / scale;
				var dy = (point.y - prevY) / scale;
				x += dx;
				y += dy;

				prevX = point.x;
				prevY = point.y;

				var maxX = findMaxX();
				if (Math.abs(x) <= maxX) {
					parent.disable();
				} else if (parent.moving()) {
					return;
				}

				dur(0);
				setTransform();
			});

			finger.on('end', function (point) {
				if (parent.moving()) return;

				var t = Date.now();
				var diff = t - prevTouchEnd;
				if (diff < 200) {
					if (scale <= 1) {
						scale = 2;
						var ic = sc2ic(finger.lastPoint);
						x = ic.x;
						y = ic.y;
						boundXandY();
						dur(500);
						setTransform();
					} else {
						scale = 1;
						x = 0;
						y = 0;
						dur(500);
						setTransform();
					}
					prevTouchEnd = 0;
					return;
				}
				prevTouchEnd = t;

				boundXandY();
				dur(500);
				setTransform();
			});
		},
		two: function (hand, finger1, finger2) {
			prevTouchEnd = 0;
			if (parent.moving()) return;
			parent.disable();

			var p1 = finger1.lastPoint;
			var p2 = finger2.lastPoint;

			var prevDist = dist(p1, p2);
			var startCenter = sc2ic(center(p1, p2));

			hand.on('move', function (points) {
				var p1 = points[0];
				var p2 = points[1];

				var newDist = dist(p1, p2);
				scale *= newDist / prevDist;
				prevDist = newDist;

				// We try and keep the same center, in
				// image coordinates, for the pinch
				// as the user had when they started.
				// This allows two finger panning, and a
				// pleasent "zooms to your fingers"
				// feeling.
				var newCenter = sc2ic(center(p1, p2));
				x += startCenter.x - newCenter.x;
				y += startCenter.y - newCenter.y;

				dur(0);
				setTransform();
			});

			hand.on('end', function () {
				var minZoom = 1;
				var maxZoom = 4;
				if (scale <= 1) {
					parent.enable();
				}
				if (scale < minZoom) {
					scale = minZoom;
					x = 0;
					y = 0;
				}
				if (scale > maxZoom) {
					scale = maxZoom;
				}
				boundXandY();
				dur(300);
				setTransform();
			});
		},
		});
	}
	var loaderImg = [
		"data:image/gif;base64,",
		"R0lGODlhEAAQAPIAAAAAAP///zw8PLy8vP///5ycnHx8fGxsbCH+GkNyZWF0ZWQgd2l0aCBhamF4",
		"bG9hZC5pbmZvACH5BAAKAAAAIf8LTkVUU0NBUEUyLjADAQAAACwAAAAAEAAQAAADMwi63P4wyklr",
		"E2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQACgABACwAAAAA",
		"EAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUk",
		"KhIAIfkEAAoAAgAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9",
		"HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkEAAoAAwAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYum",
		"CYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkEAAoABAAsAAAAABAAEAAAAzII",
		"unInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQACgAF",
		"ACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJ",
		"ibufbSlKAAAh+QQACgAGACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFG",
		"xTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAAKAAcALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdce",
		"CAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==",
	].join('');
	var defaultOpts = {
		automaticTitles: true,
		autoHideTitle: true,
	};
	return PhotoViewer;

	function round(num, places) {
		if (places === undefined) places = 0;

		var factor = Math.pow(10, places);
		return Math.round(num * factor) / factor;
	}

	function afterDOMLoad(func) {
		if (window.cards && window.cards.ready) {
			cards.ready(func);
		} else {
			setTimeout(func, 10);
		}
	}

	function forEach(arr, func) {
		for (var i = 0; i < arr.length; i++) {
			func(arr[i], i);
		}
	}

	// Removes all children of node, then adds
	// newChild as a child.
	function replaceChildren(node, newChild) {
		while (node.firstChild) {
			node.removeChild(node.firstChild);
		}
		node.appendChild(newChild);
	}

	function setTransition(elm, val) {
		elm.style.transition = val;
		elm.style.webkitTransition = '-webkit-' + val;
	}

	function setTransform(elm, val) {
		elm.style.transform = val;
		elm.style.webkitTransform = val;
	}

	// PhotoViewer takes over the content pane of your app screen.
	// It wraps SlideViewer for the common case of simply displaying
	// a set of photos in the content of your app.
	function PhotoViewer(page, urls, index, opts) {
		var self = this;
		var slideviewer;
		var dispatcher = new Dispatcher();
		var content = page.querySelector('.app-content');
		var topbar = page.querySelector('.app-topbar');
		var title = page.querySelector('.app-title');

		var topbarCover = document.createElement('div');
		var wrapper = document.createElement('div');
		wrapper.style.width = '100%';
		wrapper.style.height = '100%';

		var loaderElm = document.createElement('div');
		loaderElm.style.width = '100%';
		loaderElm.style.height = '100%';
		loaderElm.style.background = 'url(' + loaderImg + ') no-repeat center center';

		// If you want the loader element to be custom skinned for your application,
		// you can pass in an element here to be used for a placeholder while your
		// images are loading.
		self.setLoader = function (newLoaderElm) {
			loaderElm = newLoaderElm;
			if (slideviewer) {
				slideviewer.invalidate();
			} else {
				replaceChildren(content, loaderElm);
			}
			return self;
		}
		self.on = dispatcher.on;
		self.off = dispatcher.off;

		replaceChildren(content, loaderElm);

		opts = opts || {};
		for (var o in defaultOpts) {
			opts[o] = opts[o] === undefined ? defaultOpts[o] : opts[o];
		}

		if (opts.autoHideTitle) {
			Clickable(wrapper);
			wrapper.addEventListener('click', toggleTitleBar, false);
		}

		updateTitle(index, urls.length);

		page.addEventListener('appShow', appShow, false);
		page.addEventListener('appLayout', appLayout, false);
		page.addEventListener('appBack', appBack, false);
		var appShown = false;
		function appShow () {
			appShown = true;
		}
		afterDOMLoad(function () {
			if (appShown) {
				afterAppShow();
			} else {
				page.removeEventListener('appShow', appShow, false);
				page.addEventListener('appShow', afterAppShow, false);
			}
		});

		return;

		function appLayout() {
			dispatcher.fire('layout');
		}

		function appBack() {
			page.removeEventListener('appShow', appShow, false);
			page.removeEventListener('appShow', afterAppShow, false);
			page.removeEventListener('appLayout', appLayout, false);
			page.removeEventListener('appBack', appBack, false);
			if (!slideviewer) return;

			slideviewer.disable3d();
			if (App.platform !== 'ios') {
				var elm = slideviewer.curMaster();
				var img = elm.querySelector('img');
				// Removing this on iOS causes
				// flicker when transitioning
				// away from the photo viewer.
				img.style.webkitBackfaceVisibility = '';
			}
			slideviewer.eachMaster(function (elm, page) {
				if (page !== slideviewer.page()) {
					elm.style.visibility = 'hidden';
				}
			});

			// This clips the image under the titlebar, but
			// removing it causes strange flickers on android,
			// and the image to spill over into neighbouring
			// screens on iOS.
			content.style.overflow = 'hidden';
		}


		function toggleTitleBar() {
			if (topbarCover.style.visibility == '') {
				showTitleBar();
			} else {
				hideTitleBar();
			}
		}

		function showTitleBar() {
			if (App.platform == 'ios') {
				topbar.style.opacity = '1';
			} else {
				setTransform(topbar, '');
			}
			topbarCover.style.visibility = 'hidden';
		}

		function hideTitleBar() {
			if (App.platform == 'ios') {
				topbar.style.opacity = '0';
			} else {
				setTransform(topbar, 'translate3d(0, -100%, 0)');
			}
			topbarCover.style.visibility = '';
		}

		function updateTitle(i, len) {
			if (opts.automaticTitles) {
				title.innerText = (i + 1) + " of " + len;
			}
		}

		function afterAppShow() {
			if (App.platform == 'ios') {
				setTransition(topbar, 'opacity 0.5s ease-in-out 200ms');
			} else {
				setTransition(topbar, 'transform 0.5s ease-in-out 200ms');
			}
			topbarCover.addEventListener("touchstart", showTitleBar, false);

			// We don't want to have the slideview in the page when we
			// are transitioning in, as having a 3d transform within a
			// 3d transform makes things really laggy. Hence, we wait
			// until after the app is shown to add the "real" slideview
			// to the page.
			replaceChildren(content, wrapper);

			slideviewer = new SlideViewer(wrapper);
			setSource(urls);
			slideviewer.on('flip', function (page, elm) {
				updateTitle(page, urls.length);
				dispatcher.fire('flip', page);
			});
			slideviewer.refreshSize();
			slideviewer.setPage(index);

			if (App.platform == 'ios') {
				slideviewer.on('move', hideTitleBar);
			}

			// A bit of a hack, but this allows us to capture taps
			// anywhere on the screen, including on the titlebar.
			var cs = topbarCover.style;
			cs.position = "absolute";
			cs.top = topbar.offsetTop + 'px';
			cs.left = topbar.offsetLeft + 'px';
			cs.width = topbar.offsetWidth + 'px';
			cs.height = topbar.offsetHeight + 'px';
			cs.opacity = "0";
			cs.visibility = "hidden";
			page.appendChild(topbarCover);

			dispatcher.on('layout', function () {
				slideviewer.refreshSize();
				slideviewer.eachMaster(function (elm) {
					var wrap = elm.querySelector('div');
					var img = elm.querySelector('img');
					if (wrap && img) {
						centerImage(wrap, img);
					}
				});
			});
		}

		function centerImage(wrap, img) {
			// I shouldn't really have to do this, but offsetHeight and friends
			// seem to be failing sparadically. Oh well, we can do this manually!
			var h = img.naturalHeight;
			var w = img.naturalWidth;
			var r = h / w;
			var ch = opts.autoHideTitle ? window.innerHeight : content.offsetHeight;
			var cw = content.offsetWidth;

			if (h > ch) {
				h = ch;
				w = h / r;
			}

			if (w > cw) {
				w = cw;
				h = w * r;
			}

			var oh = opts.autoHideTitle ? topbar.offsetHeight : 0;
			var marginTop = round(Math.max((ch - h) / 2, 0));

			var is = img.style;
			is.marginTop = marginTop + 'px';
			is.width = w + 'px';
			is.height = h + 'px';

			var ws = wrap.style;
			ws.width = cw + 'px';
			ws.height = ch + 'px';
			ws.top = -oh + 'px';
		}

		function setSource(newSource) {
			if (!Array.isArray(newSource)) {
				throw "PhotoViewer setSource expects an array of photo URLs for a source, '" + newSource + "' given.";
			}
			urls = newSource;

			function source (i) {
				if (i < 0 || i >= urls.length) {
					throw "Out of bounds! Trying to get element at index '" + i + "', but length is only '" + urls.length + "'";
				}
				return urls[i];
			}

			slideviewer.setLen(urls.length);
			slideviewer.setSource(function (i) {
				var wrap = document.createElement('div')
				var ws = wrap.style;
				ws.position = 'absolute';
				ws.top = '0px';
				ws.left = '0px';
				ws.width = '100%';
				ws.height = '100%';
				ws.overflow = 'hidden';

				var elm = loaderElm.cloneNode(true /* deep copy */);
				wrap.appendChild(elm);

				var img = document.createElement('img');
				img.src = source(i);
				// Hack to get rid of flickering on images
				// (iPhone bug). See
				// http://stackoverflow.com/questions/3461441/prevent-flicker-on-webkit-transition-of-webkit-transform
				img.style.webkitBackfaceVisibility = 'hidden';

				img.style.webkitUserSelect = 'none';
				img.style.webkitUserDrag = 'none';
				img.style.margin = '0 auto';
				img.style.display = 'block';
				img.onload = function () {
					centerImage(wrap, img);
					replaceChildren(wrap, img);
				};
				var zoomable = new Zoomable(wrap, img, slideviewer);
				img.disable3d = function () {
					zoomable.disable3d();
				}
				img.resetZoom = function () {
					zoomable.reset();
				}
				return wrap;
			});
		}
	}
}(window.Zepto, window.jQuery, App));
