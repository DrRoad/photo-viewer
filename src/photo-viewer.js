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
			content.innerHTML = '';
			content.appendChild(loaderElm);
			if (slideviewer) slideviewer.invalidate();
			return self;
		}
		self.on = dispatcher.on;
		self.off = dispatcher.off;

		content.appendChild(loaderElm);

		opts = opts || {};
		for (var o in defaultOpts) {
			opts[o] = opts[o] === undefined ? defaultOpts[o] : opts[o];
		}

		afterDOMLoad(function () {
			if (page !== undefined) attachTo(page);
			if (urls !== undefined) setSource(urls);
			if (index !== undefined) slideviewer.setPage(index);
			if (appShown) afterAppShow();
		});

		updateTitle(index, urls.length);

		function toggleTitleBar() {
			if (topbarCover.style.visibility == '') {
				showTitleBar();
			} else {
				hideTitleBar();
			}
		}

		function showTitleBar() {
			var s = topbar.style;
			if (App.platform == 'ios') {
				topbar.style.opacity = '1';
			} else {
				topbar.style.transform = '';
				topbar.style.webkitTransform = '';
			}
			topbarCover.style.visibility = 'hidden';
		}

		function hideTitleBar() {
			var s = topbar.style;
			if (App.platform == 'ios') {
				s.opacity = '0';
			} else {
				s.transform = 'translate3d(0, -100%, 0)';
				s.webkitTransform = 'translate3d(0, -100%, 0)';
			}
			topbarCover.style.visibility = '';
		}

		function updateTitle(i, len) {
			if (opts.automaticTitles) {
				title.innerText = (i + 1) + " of " + len;
			}
		}

		var appShown = false;
		function afterAppShow() {
			if (App.platform == 'ios') {
				topbar.style.transition = 'opacity 0.5s ease-in-out';
				topbar.style.webkitTransition = 'opacity 0.5s ease-in-out';
			} else {
				topbar.style.transition = 'transform 0.5s ease-in-out';
				topbar.style.webkitTransition = '-webkit-transform 0.5s ease-in-out';
			}
			topbarCover.addEventListener("touchstart", showTitleBar, false);

			// We don't want to have the slideview in the page when we
			// are transitioning in, as having a 3d transform within a
			// 3d transform makes things really laggy. Hence, we wait
			// until after the app is shown to add the "real" slideview
			// to the page.
			content.innerHTML = '';
			content.appendChild(wrapper);

			slideviewer.refreshSize();
			dispatcher.fire('layout');

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

			var wrappers = wrapper.querySelectorAll('.slideviewer-slide');
			forEach(wrappers, function (wrapper) {
				dispatcher.on('layout', function () {
					var img = wrapper.querySelector('img');
					if (img) {
						centerImage(img);
					}
				});
			});

			dispatcher.on('layout', function () {
				slideviewer.refreshSize();
			});
		}

		function appShow () {
			appShown = true;
		}

		page.addEventListener('appShow', appShow, false);

		function attachTo(page) {
			function appLayout() {
				dispatcher.fire('layout');
			}

			function appHide() {
				page.removeEventListener('appShow', appShow, false);
				page.removeEventListener('appLayout', appLayout, false);
				page.removeEventListener('appHide', appHide, false);
			}

			slideviewer = new SlideViewer(wrapper);
			slideviewer.on('flip', function () {
				var i = slideviewer.page();
				updateTitle(i, urls.length);
				dispatcher.fire('flip', i);
			});

			if (App.platform == 'ios') {
				slideviewer.on('move', hideTitleBar);
			}

			page.addEventListener('appLayout', appLayout, false);
			page.addEventListener('appHide', appHide, false);

			if (!appShown) {
				page.removeEventListener('appShow', appShow, false);
				page.addEventListener('appShow', afterAppShow, false);
			}

			if (opts.autoHideTitle) {
				Clickable(wrapper);
				wrapper.addEventListener('click', toggleTitleBar, false);
			}
		}

		function centerImage(img) {
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
			var marginTop = round(Math.max((ch - h) / 2, 0) - oh);

			var s = img.style;
			s.marginTop = marginTop + 'px';
			s.width = w + 'px';
			s.height = h + 'px';
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
				wrap.style.width = '100%';
				wrap.style.height = '100%';

				var elm = loaderElm.cloneNode(true /* deep copy */);
				wrap.appendChild(elm);

				var img = document.createElement('img');
				img.src = source(i);
				// Hack to get rid of flickering on images. See
				// http://stackoverflow.com/questions/3461441/prevent-flicker-on-webkit-transition-of-webkit-transform
				img.style.webkitBackfaceVisibility = 'hidden';

				img.style.webkitUserSelect = 'none';
				img.style.webkitUserDrag = 'none';
				img.style.margin = '0 auto';
				img.style.display = 'block';
				img.onload = function () {
					wrap.innerHTML = '';
					centerImage(img);
					wrap.appendChild(img);
				}
				return wrap;
			});
		}
	}
}(window.Zepto, window.jQuery, App));
