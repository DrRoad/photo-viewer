// Simple event dispatcher inspired by jQuery's .on() and .off() methods.
// Useful to expose arbitrary events to a client of your library in a
// simple, fast, and familiar manner. For example, if you are writing
// yet another AJAX library, and you want clients to be able to find out
// when the ajax call has completed, you can do something like the following:
//
//    function AjaxRequest (url) {
//        var self = this;
//        var dispatcher = new Dispatcher();
//        self.on = dispatcher.on;
//        self.off = dispatcher.off;
//        self.send = function () {
//            [...]
//                 dispatcher.fire('load', data);
//        }
//    }
//
// And clients can just use it how they expect to:
//
//    var ajax = new AjaxRequest('http://www.google.com');
//    ajax.on('load', function () {
//        [...]
//    }
//    ajax.send();
//
// With full, complete namespace support, event removal, and everything else
// your users expect - in under 1kb of minified JS code.
function Dispatcher () {
	var self = this;
	function intersection (a, b) {
		var res = [];
		for (var i = 0; i < a.length; i++) {
			for (var j = 0; j < b.length; j++) {
				if (a[i] == b[j]) {
					res = res.concat(a[i]);
				}
			}
		}
		return res;
	}
	// JavaScript does reference equality for arrays by default. See
	// http://stackoverflow.com/questions/3115982/how-to-check-javascript-array-equals
	function arrEqual (a, b) {
		return a <= b && b >= a;
	}
	var events = {};

	// Attach a handler for the given event(s), and associate the given namespace(s)
	// with the event for easy removal later. Works like jQuery.on(), so
	//    dispatcher.on('click.foobar mouseup.foobar', cb);
	// will attach cb to the click and mouseup events, and additionally associate it
	// with the foobar namespace, so that you can easily remove it later with
	//    dispatcher.off('.foobar');
	self.on = function (name, cb) {
		var eventList = name.split(' ');
		for (var i = 0; i < eventList.length; i++) {
			var namebits = eventList[i].split('.');
			var event = namebits[0];
			var namespaces = namebits.splice(1);
			registerEvent(event, namespaces, cb);
		}

		function registerEvent (event, namespaces, cb) {
			events[event] = (events[event] || []).concat({
				callback: cb,
				namespaces: namespaces,
			});
		}
		return self;
	}

	// Removes handlers for the given event(s) in the given namespace(s). For
	// each event, all of the specified namespaces must exist on the handler
	// or it is not removed (this behaviour is the same as jQuery). If you
	// would like to remove several different namespaces, you can specify them
	// seperately. For example both,
	//    dispatcher.off('.foo.bar');
	//    dispatcher.off('click.foo.bar');
	// will remove only handlers registered with both foo and bar as namespaces.
	// If you want to remove handlers with either namespace, you can seperate them
	// with spaces.
	//    dispatcher.off('.foo .bar');
	//    dispatcher.off('click.foo click.bar');
	self.off = function (name) {
		var eventList = name.split(' ');
		for (var i = 0; i < eventList.length; i++) {
			var namebits = eventList[i].split('.');
			var event = namebits[0];
			var namespaces = namebits.splice(1);

			if (event === '') {
				debugger;
				for (var ev in events) {
					detachEvent(ev, namespaces);
				}
			} else {
				detachEvent(event, namespaces);
			}
		}

		function detachEvent (event, namespaces) {
			for (var i = 0; i < (events[event] || []).length; i++) {
				var ev = events[event][i];
				if (arrEqual(intersection(ev.namespaces, namespaces), namespaces)) {
					events[event].splice(i, 1);
					i--;
				}
			}
		}
		return self;
	}

	// Fire an event with the given name, passing the later arguments as parameters
	// to all registered callbacks.
	self.fire = function (name /*, arguments */) {
		var handlers = events[name] || [];
		var args = Array.prototype.slice.call(arguments, 1);
		for (var i = 0; i < handlers.length; i++) {
			handlers[i].callback.apply(null, args);
		}
		return self;
	}
}

// PhotoViewer takes over the content pane of your app screen.
// It wraps SlideViewer for the common case of simply displaying
// a set of photos in the content of your app.
function PhotoViewer (page, urls, index) {
	var self = this;
	var slideviewer;
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

(function ($, cards, App) {
	App.populator('viewer', function (page, data) {
		var urls  = data.images;
		var p = new PhotoViewer(page, urls, parseInt(data.index, 10))
		p.on('flip', function (i) {
			data.index = i;
			App.saveStack();
		});
	});
	App.populator('gallery', function (page, data) {
		var urls = data.images;

		function addImage (page, urls, index) {
			var url = urls[index];
			var img = document.createElement('img');
			img.src = url;
			img.style.width = '50%';
			page.appendChild(img);
			img.onclick = function () {
				App.load('viewer', {images: urls, index: index});
			}
		}

		var el = page.querySelector('.app-content');
		for (var i = 0; i < urls.length; i++) {
			addImage(el, urls, i);
		}
	})

	var images = [
'http://theosophical.files.wordpress.com/2011/06/zero2.jpg',
'http://2.bp.blogspot.com/-pi1jelOHWAA/UJ0rN3F0M-I/AAAAAAAAANE/nqbgpZjIbFk/s1600/edit(27117).png',
'http://www.underdogmillionaire.com/blog/wp-content/uploads/2011/04/2-steps-to-get-rich.png',
'http://www.techdigest.tv/three-logo-thumb.jpg',
'http://danblackonleadership.info/wp-content/uploads/2012/12/Four-Steps-to-Develop-and-Install-Your-HOLD-PLUS-System.png',
'http://us.123rf.com/400wm/400/400/virinka/virinka1112/virinka111200409/11659584-cartoon-number-five.jpg',
'https://twimg0-a.akamaihd.net/profile_images/1839102782/High_Six_logo.jpg',
'http://mwafrica.files.wordpress.com/2008/11/seven-logo-large1.jpg',
'http://longlivejudyism.files.wordpress.com/2010/11/eight-ball.jpg',
	];
	App.load('viewer', {images: images, index: 0});

// 	try {
// 		App.restore();
// 	}
// 	catch (err) {
// 		App.load('gallery', {images: images});
// 	}

})(Zepto, cards, App);
