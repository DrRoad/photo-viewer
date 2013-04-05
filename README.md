PhotoViewer
===========

"Smoother than native"

PhotoViewer is an aggressively optimized and thouroghly tested photo viewer
library for [App.js](https://github.com/kikinteractive/app).
It works across all modern browsers, including Android 2.1 and iOS 5.

Don't believe us? Try the demo (preferably on your phone, it's easy to be
smooth on desktop): http://code.kik.com/photo-viewer/demos/index.html

Why is it smoother than the competition? A deep understanding of how modern
browsers work under the hood allowed us to take full advantage of the
capabilities of the modern browser. On recent iOS and Android devices, we
put the slider in it's own 3d layer, computed once and stored as a texture
on the GPU. This effectively means that every move can be optimized by the
browser to nothing more than a (fast!) OpenGL call to change the texture
coordinates. Even on older phones, we move the slider without a reflow,
requiring only a repaint to update the screen.

PhotoViewer is suitable for photo galleries of any size, as long as the list
of photo URLs can fit within the memory of the browser. Under the hood, it
only ever handles a maximum of three photos at once, meaning you get super
fast performance regardless of how large your album is.

Ready for smooth? __Download__ (minified): [photo-viewer.js](http://cdn.kik.com/photo-viewer/1/photo-viewer.js)


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
	});

And customize the options to your needs:

	var photoViewer = new PhotoViewer(page, urls, {
		// Automatically update the page title as the user swipes through
		// photos?
		automaticTitles: true,
		// Hide the titlebar automatically, using whichever gestures are
		// recognized on the device's native photo viewer.
		autoHideTitle: true,
		// An element used as a placeholder while photos are loading.
		// A duplicate is made each time it is used.
		loadingElm: defaultLoadingElm,
		// Photo index to start at.
		startAt: 0,
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
	App.load('viewer', {
		urls: ['funny-cat-picture.jpg', 'funny-lolcat.jpg'],
		index: 1,
	});
