// Simple event dispatcher based off of jQuery. Supports
// dispatching of arbitrary events, event namespaces, and
// calling event handlers with arguments. Does not
// support binding multiple events in a single call, or
function Dispatcher () {
	var self = this;
	function intersection(a, b) {
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
	function arrEqual(a, b) {
		return a <= b && b >= a;
	}
	var events = {};

	self.on = function (name, cb) {
		var namebits = name.split('.');
		var event = namebits[0];
		var namespaces = namebits.splice(1);

		events[event] = (events[event] || []).concat({
			callback: cb,
			namespaces: namespaces,
		});
		return self;
	}

	self.off = function (name) {
		var namebits = name.split('.');
		var event = namebits[0];
		var namespaces = namebits.splice(1);

		for (var i = 0; i < (events[event] || []).length; i++) {
			var ev = events[event][i];
			if (arrEqual(intersection(ev.namespaces, namespaces), namespaces)) {
				events[event].splice(i, 1);
				i--;
			}
		}
		return self;
	}

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
function PhotoViewer (page, urls, index) {
	var self = this;
	var slideview;

	function attachTo (page) {
		function appShow () {
			page.querySelector('.app-content').appendChild(wrapper);
			slideview.refreshSize();
		}

		function appLayout () {
			slideview.refreshSize();
		}

		function appHide () {
			page.removeEventListener('appShow', appShow, false);
			page.removeEventListener('appLayout', appLayout, false);
			page.removeEventListener('appHide', appHide, false);
		}

		var wrapper = document.createElement('div');
		wrapper.style.width = '100%';
		wrapper.style.height = '100%';
		wrapper.style.background = 'black url("../img/background.png")';
		wrapper.style.color = 'white';

		slideview = new SlideView(wrapper);
		slideview.on('flip', function () {
			dispatcher.fire('flip', slideview.page());
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

		slideview.setLen(newSource.length);
		slideview.setSource(function (i) {
			var div = document.createElement('div');
			div.style.width = '100%';
			div.style.height = '100%';
			// black url('../img/ajax-loader.gif') no-repeat center center
			div.style.background = 'url("' + source(i) + '") center center no-repeat';
			return div;
		});
	}

	var dispatcher = new Dispatcher();
	self.on = dispatcher.on;
	self.off = dispatcher.off;

	if (page !== undefined) attachTo(page);
	if (urls !== undefined) setSource(urls);
	if (index !== undefined) slideview.setPage(index);
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
'http://danblackonleadership.info/wp-content/uploads/2012/12/Four-Steps-to-Develop-and-Install-Your-HOLD-PLUS-System.png'
	];
// 	App.load('gallery', {images: images});

	try {
		App.restore();
	}
	catch (err) {
		App.load('gallery', {images: images});
	}

})(Zepto, cards, App);
