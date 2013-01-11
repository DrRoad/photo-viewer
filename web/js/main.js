function Dispatcher () {
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
	var events = {};
	this.on = function (name, cb) {
		var namebits = name.split('.');
		var event = namebits[0];
		var namespaces = namebits.splice(1);

		events[event] = (events[event] || []).concat({
			callback: cb,
			namespaces: namespaces,
		});
		return this;
	}
	this.off = function (name) {
		var namebits = name.split('.');
		var event = namebits[0];
		var namespaces = namebits.splice(1);

		for (var i = 0; i < events[event].length; i++) {
			var ev = events[event][i];
			if (intersection(ev, namespaces).length > 0) {
				events[event].splice(i, 1);
				i--;
			}
		}
		return this;
	}
	this.fire = function (name /*, arguments */) {
		var handlers = events[name] || [];
		var args = Array.prototype.slice.call(arguments, 1);
		for (var i = 0; i < handlers.length; i++) {
			handlers[i].callback(args);
		}
		return this;
	}
}

// SlideView takes over the content pane of your app screen.
// DO NOT attempt to do anything to the app screen other than
// through SlideView, or else things may (will probably) break.
function SlideView (page) {
	var len = 0;

	var wrapper = document.createElement('div');
	wrapper.style.width = '100%';
	wrapper.style.height = '100%';

	var swipeview = new SwipeView(wrapper, {
		numberOfPages: 0,
		hastyPageFlip: true,
		loop: false,
	});

	function isElement (o) {
		return (
			typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
			o && typeof o === "object" && o.nodeType === 1 && typeof o.nodeName==="string"
		);
	}

	function changeLen (newLen) {
		swipeview.updatePageCount(newLen);
		len = newLen;
	}

	function getElement (i) {
		function errorPage(customMessage) {
			var err = document.createElement('p');
			err.innerHTML = "There was an error creating this page! Contact the developer for more information..." + "<br><br>" + customMessage;
			return err;
		}

		if (i < 0) return document.createElement('div');//? i + len : i;
		var element = null;
		try {
			element = source(i);
		} catch (e) {
			return errorPage("Exception returned from source() function with input " + i + ". Message: " + e);
		}

		if (typeof element === 'string') {
			var img = document.createElement('img');
			img.src = element;
			return img;
		} else if (isElement(element)) {
			return element;
		} else {
			return errorPage("Invalid type returned from source() function. Got type " + typeof element + " (with value " + element + "), expected string or node. Input was " + i);
		}
	}

	function initSlides () {
		for (var i = 0; i < 3; i++) {
			var el = document.createElement('div');
			el.style.width = window.innerWidth;
			el.style.overflow = 'hidden';
			el.className = 'slideview-slide';
			swipeview.masterPages[i].appendChild(el);
			el.appendChild(getElement(i - 1));
		}
	}

	swipeview.onFlip(function () {
		for (var i = 0; i < 3; i++) {
			var m = swipeview.masterPages[i];
			var d = m.dataset;
			if (d.upcomingPageIndex == d.pageIndex) continue;

			try {
				var slide = m.querySelector('.slideview-slide');
				slide.innerHTML = '';
				console.log(d.upcomingPageIndex, d.pageIndex);
				var el = getElement(d.upcomingPageIndex);
				slide.appendChild(el);
			} catch (e) {
				debugger;
			}
		}
		dispatcher.fire('change', swipeview.page);
	});

	var index = 0;
	page.addEventListener('appShow', function () {
		page.querySelector('.app-content').appendChild(wrapper);
		swipeview.refreshSize();
		swipeview.goToPage(index);
	});

	page.addEventListener('appLayout', function () {
		swipeview.refreshSize();
	}, false);

	var elements;

	var dispatcher = new Dispatcher();
	this.on = dispatcher.on;
	this.off = dispatcher.off;

	// List can be either a list of slides, or a function which can return the ith
	// element in an arbitrary list upon demand. Both the list and the function can
	// contian/return elements, in which case each element is taken to represent a
	// slide, or strings, in whcih case each element is taken to represent an image.
	this.source = function (newSource) {
		var newLen;
			changeLen(100000000);
		if (typeof newSource === 'function') {
			// Should be big enough
			source = newSource;
		} else if (Array.isArray(newSource)) {
// 			changeLen(newSource.length);
			source = function (i) {
				if (i < 0 || i >= newSource.length) {
					throw "Out of bounds! Trying to get element at index '" + i + "', but length is only '" + newSource.length + "'";
				}
				return newSource[i];
			}
		} else {
			throw "Error: Unsupported argument to SlideView.source: '" + newSource + "'";
		}
		swipeview.updatePageCount(len);
		initSlides();
		return this;
	}

	this.page = function (newPage) {
		if (newPage === undefined) {
			return index;
		}
		if (typeof newPage !== 'number') {
			throw "Give me a number please!";
		}
		swipeview.goToPage(newPage);
		index = newPage;
		return this;
	}

	// TODO: DESTROY
	this.destroy = function () {
		throw "Error: SlideView.destroy() is not yet implemented. Bug Justin.";
	}
}

(function (window, document, $, cards, App) {
	function realMod(a, b) {
		return ((a % b) + b) % b
	}
	App.populator('viewer', function (page, data) {
		var urls  = data.images;
		var sv = new SlideView(page);
		sv.source(urls).page(parseInt(data.index, 10)).on('change', function (i) {
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
// 			img.style.float = 'left';
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
'http://1.bp.blogspot.com/-107YXK-eAXs/UB6V49H9yuI/AAAAAAAACsY/69ceZJXaYZE/s1600/number-one-.png',
'http://www.underdogmillionaire.com/blog/wp-content/uploads/2011/04/2-steps-to-get-rich.png',
'http://openclipart.org/people/horse50/three.svg',
'http://info.boltinsurance.com/Portals/16893/images/Four%20Risk%20Control%20Strategies.jpg'
	];
// 	App.load('gallery', {images: images});

	try {
		App.restore();
	}
	catch (err) {
		App.load('gallery', {images: images});
	}

})(window, document, Zepto, cards, App);
