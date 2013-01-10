function SlideView(page, data) {
	// Normal mod (%) operator in javascript is screeeeeewed up
	// this one works properly.
	function realMod(a, b) {
		return ((a % b) + b) % b
	}

	var wrapper = page.querySelector('.swipeview') || document.createElement('div');
	wrapper.style.width = '100%';
	wrapper.style.height = '100%';

	var swipeview = new SwipeView(wrapper, {
		numberOfPages: 0,
		hastyPageFlip: true,
	});

	for (var i = 0; i < 3; i++) {
		var el = document.createElement('div');
		el.style.width = window.innerWidth;
		el.style.overflow = 'hidden';
		el.className = 'slideview-slide';
		el.appendChild(getElement(i));
		swipeview.masterPages[i].appendChild(el);
	}

	function getElement(i) {
		var element = elements[i];
		if (typeof element === 'string') {
			var img = document.createElement('img');
			img.src = element;
			return img;
		} else {
			return element;
		}
	}

	wrapper.addEventListener('swipeview-flip', function () {
		data.index = realMod(gallery.page, elements.length);
		App.saveStack();

		for (var i = 0; i < 3; i++) {
			var m = gallery.masterPages[i];
			var d = m.dataset;
			if (d.upcomingPageIndex == d.pageIndex) continue;

			var el = m.querySelector('.slideview-slide');
			el.innerHTML = '';
			el.appendChild(getElement(i));
		}
	}, false);

	page.addEventListener('appLayout', function () {
		if (!initialized) {
			// TODO
		} else {
			swipeview.refreshSize();
			swipeview.goToPage(data.index);
		}
	}, false);

	var elements;
	// List can be either a list of elements, in which case each element
	// is taken to represent a slide, or strings, in whcih case each element
	// is taken to represent an image.
	this.useList = function(list) {
		// TODO: Should probably sanity check here.
		swipeview.updatePageCount(list.length);
		elements = list;
	}
}

(function (window, document, $, cards, App) {
	function realMod(a, b) {
		return ((a % b) + b) % b
	}
	App.populator('viewer', function (page, data) {
		var urls  = data.images;
		var index = data.index;

		var swipeview = page.querySelector('.swipeview-wrapper');
		var gallery = new SwipeView(swipeview, { numberOfPages: urls.length, hastyPageFlip: true });

		// Load initial data
		for (var i = 0; i < 3; i++) {
			var img = document.createElement('img');
			img.width = window.innerWidth;
			gallery.masterPages[i].appendChild(img);
		}

		gallery.onFlip(function () {
			data.index = realMod(gallery.page, urls.length);
			App.saveStack();

			for (var i = 0; i < 3; i++) {
				var m = gallery.masterPages[i];
				var d = m.dataset;

				// No update needed
// 				if (d.upcomingPageIndex == d.pageIndex) continue;

				var el = m.querySelector('img');
				el.src = urls[d.upcomingPageIndex];
			}

		});

		page.addEventListener('appLayout', function() {
			gallery.refreshSize();
			gallery.goToPage(data.index);
		}, false);
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
