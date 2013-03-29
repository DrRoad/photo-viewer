var PhotoViewer = (function (Zepto, jQuery, App) {
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

	var defaultLoadingElm = (function () {
		var elm = document.createElement('div');
		var s = elm.style;
		s.width = '100%';
		s.height = '100%';
		s.background = 'url(' + loaderImg + ') no-repeat center center';
		return elm;
	}());

	var defaultOpts = {
		startAt: 0,
		automaticTitles: true,
		autoHideTitle: true,
		loadingElm: defaultLoadingElm,
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
	function PhotoViewer(page, urls, opts) {
		var self = this;
		var slideviewer;
		var eventBus = new EventBus();
		var content = page.querySelector('.app-content');
		content.setAttribute("data-no-scroll", "true");
		var topbar = page.querySelector('.app-topbar');
		var title = page.querySelector('.app-title');

		var topbarCover = document.createElement('div');
		var wrapper = document.createElement('div');
		wrapper.style.width = '100%';
		wrapper.style.height = '100%';

		self.on = eventBus.on;
		self.off = eventBus.off;

		function validateArgs() {
			if (!page) throw "Page argument required!";
			if (!urls) throw "You gave me an empty list of urls, I can't do anything with that!";
			if (!Array.isArray(urls)) {
				throw "PhotoViewer setSource expects an array of photo URLs for a source, '" + newSource + "' given."
			}
			opts = opts || {};
			for (var o in defaultOpts) {
				opts[o] = opts[o] === undefined ? defaultOpts[o] : opts[o];
			}
		}
		validateArgs();

		replaceChildren(content, opts.loadingElm);

		if (opts.autoHideTitle) {
			Clickable(wrapper);
			wrapper.addEventListener('click', toggleTitleBar, false);
		}

		updateTitle(opts.startAt, urls.length);

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
			if (!slideviewer) return;
			slideviewer.refreshSize();
			slideviewer.eachMaster(function (elm) {
				var wrap = elm.querySelector('div');
				var img = elm.querySelector('img');
				if (wrap && img) {
					centerImage(wrap, img);
				}
			});
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

			slideviewer = new PhotoViewer._SlideViewer(wrapper, source, {
				allowScroll: false,
				length: urls.length,
				startAt: opts.startAt,
				bufferDist: 50,
			});
			slideviewer.on('flip', onFlip);
			onFlip(opts.startAt, slideviewer.curMaster());

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

			function source(i) {
				var wrap = document.createElement('div')
				var ws = wrap.style;
				ws.position = 'absolute';
				ws.top = '0px';
				ws.left = '0px';
				ws.width = '100%';
				ws.height = '100%';
				ws.overflow = 'hidden';

				var loading = opts.loadingElm.cloneNode(true /* deep copy */);
				wrap.appendChild(loading);

				var img = document.createElement('img');
				img.src = urls[i];

				// Hack to get rid of flickering on images (iPhone bug) by
				// forcing hardware acceleration. See
				// http://stackoverflow.com/questions/3461441/prevent-flicker-on-webkit-transition-of-webkit-transform
				img.style.webkitBackfaceVisibility = 'hidden';

				// For desktop browsers
				img.style.webkitUserSelect = 'none';
				img.style.webkitUserDrag = 'none';

				img.style.margin = '0 auto';
				img.style.display = 'none';

				img.onload = function () {
					centerImage(wrap, img);
					img.style.display = 'block';
					wrap.removeChild(loading);

					// This invalidates the area occupied by the image
					// wrapper, and forces the browser to redraw it. Removing
					// this will cause strange artifacts to remain in the
					// background for android 4.2 devices.
					setTimeout(function () {
						ws.background = '#000';
						setTimeout(function () {
							ws.top = 'transparent';
						}, 0);
					}, 0);
				};
				wrap.appendChild(img);
				return wrap;
			}

			var zoomable;
			function onFlip(page, elm) {
				updateTitle(page, urls.length);

				var wrap = elm.querySelector('div');
				var img = elm.querySelector('img');

				if (zoomable) zoomable.reset().destroy();
				zoomable = new PhotoViewer._Zoomable(wrap, img, slideviewer);

				eventBus.fire('flip', page);
			}
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
	}

	// http://github.com/crazy2be/EventBus.js
	function EventBus() {
		var self = this;
		var callbacks = {};
		self.callbacks = callbacks;

		// remove modifies the list which it is passed,
		// removing all occurances of val.
		function remove(list, val) {
			for (var i = 0; i < list.length; i++) {
				if (list[i] === val) {
					list.splice(i, 1);
				}
			}
		}

		// Register a callback for the specified event. If the
		// callback is already registered for the event, it is
		// not added again.
		self.on = function (ev, cb) {
			var list = callbacks[ev] || [];
			remove(list, cb);
			list.push(cb);
			callbacks[ev] = list;
			return self;
		}

		// Remove a callback for the specified event. If the callback
		// has not been registered, it does not do anything. If the
		// second argument is undefined, it removes all handlers for
		// the specified event.
		self.off = function (ev, cb) {
			if (cb === undefined) {
				delete callbacks[ev];
				return self;
			}
			var list = callbacks[ev];
			if (!list) return self;
				   remove(list, cb);
			return self;
		}

		// Fire an event, passing each registered handler all of
		// the specified arguments. Within the handler, this is
		// set to null.
		self.fire = function (ev, arg1, arg2/*, ...*/) {
			var list = callbacks[ev];
			if (!list) return;
				   var args = Array.prototype.slice.call(arguments, 1);
			for (var i = 0; i < list.length; i++) {
				list[i].apply(null, args);
			}
			return self;
		}
	}
}(window.Zepto, window.jQuery, App));
