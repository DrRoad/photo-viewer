// SlideView takes over the content pane of your app screen.
// DO NOT attempt to do anything to the app screen other than
// through SlideView, or else things may (will probably) break.
function SlideView(page, data) {
	// Normal mod (%) operator in javascript is screeeeeewed up
	// this one works properly.
	function realMod (a, b) {
		return ((a % b) + b) % b
	}

	var wrapper = document.createElement('div');
	wrapper.style.width = '100%';
	wrapper.style.height = '100%';

	var swipeview = new SwipeView(wrapper, {
		numberOfPages: 0,
		hastyPageFlip: true,
	});

	page.querySelector('.app-content').appendChild(wrapper);

	function getElement (i) {
		i = realMod(i, elements.length);
		var element = elements[i];
		if (typeof element === 'string') {
			var img = document.createElement('img');
			img.src = element;
			return img;
		} else {
			return element;
		}
	}

	function initSlides () {
		for (var i = 0; i < 3; i++) {
			var el = document.createElement('div');
			el.style.width = window.innerWidth;
			el.style.overflow = 'hidden';
			el.className = 'slideview-slide';
			el.appendChild(getElement(i - 1));
			swipeview.masterPages[i].appendChild(el);
		}
		return this;
	}

	wrapper.addEventListener('swipeview-flip', function () {
		data.index = realMod(swipeview.page, elements.length);
		App.saveStack();

		for (var i = 0; i < 3; i++) {
			var m = swipeview.masterPages[i];
			var d = m.dataset;
			if (d.upcomingPageIndex == d.pageIndex) continue;

			var el = m.querySelector('.slideview-slide');
			el.innerHTML = '';
			el.appendChild(getElement(d.upcomingPageIndex));
		}
	}, false);

	page.addEventListener('appLayout', function () {
		swipeview.refreshSize();
		swipeview.goToPage(data.index);
	}, false);

	var elements;

	// List can be either a list of elements, in which case each element
	// is taken to represent a slide, or strings, in whcih case each element
	// is taken to represent an image.
	this.useList = function (list) {
		// TODO: Should probably sanity check here.
		swipeview.updatePageCount(list.length);
		elements = list;
		initSlides();
		return this;
	}
}

(function (window, document, $, cards, App) {
	function realMod(a, b) {
		return ((a % b) + b) % b
	}
	App.populator('viewer', function (page, data) {
		var urls  = data.images;
		var sv = new SlideView(page, data);
		sv.useList(urls);
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
