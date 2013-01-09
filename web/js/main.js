(function (window, document, $, cards, App, MyAPI) {

	App.populator('viewer', function (page, data) {
		var urls  = data.images,
			index = data.index;

		//TODO: load image
		function loadImage (index) {
			//TODO
			data.index = index;
			App.saveStack();
		}
	});

	try {
		App.restore();
	}
	catch (err) {
		App.load('gallery');
	}

})(window, document, Zepto, cards, App, MyAPI);
