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
	return PhotoViewer;

	// PhotoViewer takes over the content pane of your app screen.
	// It wraps SlideViewer for the common case of simply displaying
	// a set of photos in the content of your app.
	function PhotoViewer (page, urls, index) {
		var self = this;
		var slideviewer;

		function attachTo (page) {
			function appShow () {
				page.querySelector('.app-content').appendChild(wrapper);
				slideviewer.refreshSize();
			}

			function appLayout () {
				slideviewer.refreshSize();
			}

			function appHide () {
				page.removeEventListener('appShow', appShow, false);
				page.removeEventListener('appLayout', appLayout, false);
				page.removeEventListener('appHide', appHide, false);
			}

			var wrapper = document.createElement('div');
			wrapper.style.width = '100%';
			wrapper.style.height = '100%';

			slideviewer = new SlideViewer(wrapper);
			slideviewer.on('flip', function () {
				dispatcher.fire('flip', slideviewer.page());
			});

			page.addEventListener('appShow', appShow, false);
			page.addEventListener('appLayout', appLayout, false);
			page.addEventListener('appHide', appHide, false);
		}

		function setSource (newSource) {
			var len;
			if (!Array.isArray(newSource)) {
				throw "PhotoViewer setSource expects an array of photo URLs for a source, '" + newSource + "' given.";
			}

			source = function (i) {
				if (i < 0 || i >= newSource.length) {
					throw "Out of bounds! Trying to get element at index '" + i + "', but length is only '" + newSource.length + "'";
				}
				return newSource[i];
			}

			slideviewer.setLen(newSource.length);
			slideviewer.setSource(function (i) {
				var wrap = document.createElement('div')
			wrap.style.width = '100%';
			wrap.style.height = '100%';

			var elm = loaderElm.cloneNode(true /* deep copy */);
			wrap.appendChild(elm);

			var img = new Image();
			img.src = source(i);
			// Hack to get rid of flickering on images. See
			// http://stackoverflow.com/questions/3461441/prevent-flicker-on-webkit-transition-of-webkit-transform
			img.style.webkitBackfaceVisibility = 'hidden';
			img.onload = function () {
				wrap.innerHTML = '';
				wrap.appendChild(tbl);
			}

			// All of this is just a gross hack to get the image centered along both the
			// horizontal and vertical axis. *Sigh*.
			var cell = document.createElement('td');
			cell.style.verticalAlign = 'middle';
			cell.style.textAlign = 'center';
			cell.appendChild(img);

			var row = document.createElement('tr');
			row.appendChild(cell);

			var tbl = document.createElement('table');
			tbl.style.width = '100%';
			tbl.style.height = '100%';
			tbl.appendChild(row);
			return wrap;
			});
		}

		var dispatcher = new Dispatcher();
		self.on = dispatcher.on;
		self.off = dispatcher.off;

		var loaderElm = document.createElement('div');
		loaderElm.style.width = '100%';
		loaderElm.style.height = '100%';
		loaderElm.style.background = 'url(' + loaderImg + ') no-repeat center center';

		// If you want the loader element to be custom skinned for your application,
		// you can pass in an element here to be used for a placeholder while your
		// images are loading.
		self.setLoader = function (newLoaderElm) {
			loaderElm = newLoaderElm;
			return self;
		}

		if (page !== undefined) attachTo(page);
		if (urls !== undefined) setSource(urls);
		if (index !== undefined) slideviewer.setPage(index);
	}
}(window.Zepto, window.jQuery, App));
