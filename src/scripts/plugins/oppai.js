var util = require('../plugin-utils');
var $ = require('jquery');
var Oppai = require('oppai.js');

util.registerPlugin({
	name: 'oppai',
	transform: function(key, value) {
		function getNumbers(str) {
			return str.match(/\d+/g).map(Number);
		}

		if (key === 'left_vertex' || key === 'right_vertex')
			value = getNumbers(value);

		else if (key === 'left_round_coords' || key === 'right_round_coords')
			value = value.match(/\d+\D+\d+/g).map(getNumbers);

		return value;
	},
	callback: function(element, option) {
		var canvas = $('<canvas/>');
		var left = null;
		var right = null;

		if (option.left_vertex && option.left_round_coords) {
			left = {
				vertex: option.left_vertex,
				round_coords: option.left_round_coords
			};
		}

		if (option.right_vertex && option.right_round_coords) {
			right = {
				vertex: option.right_vertex,
				round_coords: option.right_round_coords
			};
		}

		var oppai = new Oppai(canvas[0], option.image_url, {enableTouch: true}, left, right);
		oppai.load();

		var last = 0;
		$(window).scroll(function() {
			var now = +new Date();
			if (now < last + 400)
				return;

			canvas.click();
			last = now;
		});

		return canvas;
	}
});
