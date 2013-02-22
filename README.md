photo-viewer.js - Look Ma! I built you a photo gallery!
=======================================================

Simply the fastest, smoothest, easiest photo viewer library. Designed to work with [App.js](http://code.kik.com/photo-viewer/demos/basic.html). Take a look at the [Demo](http://code.kik.com/photo-viewer/demos/index.html)!

__Download__ (minified): [photo-viewer.js v1](http://cdn.kik.com/photo-viewer/1/photo-viewer.js)


Usage
-----

For basic usage, just give the PhotoViewer your page, and some urls to munch on:

	App.populator('viewer', function (page, data) {
		var photoViewer = new PhotoViewer(page, data.urls);
	}

You can listen to events:

	photoViewer.on('flip', function (page) {
		data.index = page;
		App.saveStack();
	}

And customize the options to your needs:

	var photoViewer = new PhotoViewer(page, urls, {
		// Setting this to false (true is the default) tells
		// PhotoViewer not to mess with your page's title.
		// By default, PhotoViewer will automatically change
		// the title as the user swipes through the list,
		// in order to reflect their position in the queue.
		automaticTitles: true,

		// Setting this to false (true is the default) tells
		// PhotoViewer not to hide the title bar when the user
		// taps or swipes (depending on platform).
		// It also makes images vertically centered relative
		// to only the app content, rather than the whole page.
		autoHideTitle: true,

		// Setting this option allows you to customize the
		// loading screen to fit the theme of your application.
		// myLoadingElement is any html element, from the DOM
		// or hand crafted. A duplicate is made each time it
		// is used.
		loadingElm: myLoadingElement,

		// Setting this option allows you to start the viewer
		// on an image other than the first image.
		startAt: 4,
	});

A complete example of a typical PhotoViewer user:

	App.populator('viewer', function (page, data) {
		var photoViewer = new PhotoViewer(page, data.urls, {
			startAt: parstInt(data.index, 10),
		});
		photoViewer.on('flip', function (page) {
			data.index = page;
			App.saveStack();
		});
	});

Notes
-----

Your content needs to be non-scrollable for this to work. Scrollable's hacks interfere with our positioning.

	<div class="app-content" data-no-scroll="true"></div>


<!---
slide-viewer.js - An Essential Part of a Slick, Smooth, and Slidy Mobile UI
===========================================================================
// TODO
[slide-viewer.js v1](http://cdn.kik.com/photo-viewer/1/slide-viewer.js)

Usage with ZeptoJS or jQuery
----------------------------

//TODO




Standalone Usage
----------------

//TODO
-->
