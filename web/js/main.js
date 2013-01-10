(function (window, document, $, cards, App) {
	function properMod(a, b) {
		return ((a % b) + b) % b
	}
	App.populator('viewer', function (page, data) {
		var urls  = data.images,
			index = data.index;
		console.log(data.index);
// 		var elwrap = page.querySelector('.app-content');
// 		var el = document.createElement('div');
// 		el.className = 'swipeview-wrapper';
// 		elwrap.innerHTML = el.outerHTML;
		el = page.querySelector('.swipeview-wrapper');
// 		var img = document.createElement('img');
// 		img.src = url;
// 		img.style.width = '100%';
// 		el.innerHTML = img.outerHTML;
// 		function loadImage (index) {
// 			//TODO
// 			data.index = index;
// 			App.saveStack();
// 		}
		var gallery = new SwipeView(el, { numberOfPages: urls.length });
// 		gallery.goToPage(index);

		// Load initial data
		for (var i = 0; i < 3; i++) {
// 			var j = i + index;
			var j = i;
// 			var k = properMod(j + index, urls.length);
			var pageindex = (j == 0) ? urls.length - 1 : j - 1;
			el = document.createElement('img');
			el.src = urls[pageindex];
			el.width = window.innerWidth;

			var p = gallery.masterPages[i];
			p.appendChild(el);
// 			p.dataset.pageIndex = k;
		}

		gallery.onFlip(function () {
			data.index = properMod(gallery.page, urls.length);
			console.log(data.index);
			App.saveStack();
			for (var i = 0; i < 3; i++) {
				var upcoming = gallery.masterPages[i].dataset.upcomingPageIndex;
// 				console.log("upcoming", upcoming);
// 				upcoming = properMod(upcoming + i, urls.length);
// 				var pageindex = (i == 0) ? urls.length - 1 : i - 1;
// 				console.log(upcoming, i);
// 				console.log("upcoming", upcoming);

				var pageIndex = gallery.masterPages[i].dataset.pageIndex;
// 				pageIndex = properMod(pageIndex + index, urls.length);
// 				console.log("pageIndex:", pageIndex);
				console.log(upcoming, pageIndex, i);
// 				if (upcoming != pageIndex) {
					var el = gallery.masterPages[i].querySelector('img');
// 					el.className = 'loading';
					el.src = urls[upcoming];
			}

// 			document.querySelector('#nav .selected').className = '';
// 			dots[gallery.pageIndex+1].className = 'selected';
		});

		// Yum yum
		// Our DOM element is not yet in the tree
		// when this callback is called, but
		// SwipeView assumes it should be when it
		// initializes, and only grabs the width once.
		// This will fail if the user interacts with
		// the page in less than one second. Should
		// really be done onload or something.
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
