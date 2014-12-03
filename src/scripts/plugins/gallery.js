var util = require('../plugin-utils');
var $ = require('jquery');
var loader = require('../sheetloader');
require('fotorama');

module.exports = function() {
	util.registerPlugin({
		name: 'gallery',
		callback: function(element, option) {
			if (!option.key) {
				element
					.text('エラー：key が指定されていません')
					.addClass('error')
					.removeClass('hidden');

				return;
			}

			element
				.css({height: 0, opacity: 0})
				.html('<div class="spinner"/>')
				.removeClass('hidden');

			var pad = (option.thumbheight || 64) + (option.thumbmargin || 2) * 2;
			var height = Math.ceil(element.width() * 9 / 16 + pad);

			element.animate({height: height, opacity: 1}, 200);

			loader(option.key)
				.done(function(data) {
					$.each(data, function(i, item) {
						delete item.id;
						delete item.html;
					});

					element
						.on('fotorama:ready', function() {
							element.animate({height: $this.children().height(), opacity: 1}, 200, function() {
								element.css({height: ''});
							});
						})
						.fotorama(option);
				})
				.fail(function() {
					element
						.text('エラー：スプレッドシートを読み込めません')
						.addClass('error')
						.removeClass('hidden');
				});
		}
	});
};
