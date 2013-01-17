photo-viewer.js - Look Ma! I built you a photo gallery!
=======================================================

Simply the fastest, smoothest, easiest photo viewer library. Designed to work with [App.js](http://code.kik.com/photo-viewer/demos/basic.html). Take a look at the [Demo](http://code.kik.com/photo-viewer/demos/basic.html)!

*Download*: [photo-viewer.js v1](http://cdn.kik.com/photo-viewer/1/photo-viewer.js)


Usage
-----

For basic usage, just add the PhotoViewer to your page:

	App.populator('viewer', function (page, data) {
		var photoViewer = new PhotoViewer(page, data.urls, parseInt(data.index, 10));
	}

You can listen to events:

	photoViewer.on('flip', function (page) {
		data.index = page;
		App.saveStack();
	}

And skin the loading screen:

	var myLoadingElement = document.createElement('div');

	[... style your element ...]

	photoViewer.setLoader(myLoadingElement);


Notes
-----

Your content needs to be non-scrollable for this to work. Scrollable's hacks interfere with our positioning.

	<div class="app-content" data-no-scroll="true"></div>


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
