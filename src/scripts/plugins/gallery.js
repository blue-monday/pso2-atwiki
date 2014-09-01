define(['jquery', 'sheetloader', 'plugin-utils', 'fotorama'], function($, loader, util) {
	$(function() {
		$('.gallery').each(function() {
			var $this = $(this);
			var option = util.parseOption($this, true);
			if (!option.key) {
				$this
					.text('エラー：key が指定されていません')
					.addClass('error')
					.removeClass('hidden');

				return;
			}

			$this
				.data('option', option)
				.css({height: 0, opacity: 0})
				.html('<div class="spinner"/>')
				.removeClass('hidden');

			var pad = (option.thumbheight || 64) + (option.thumbmargin || 2) * 2;
			var height = Math.ceil($this.width() * 9 / 16 + pad);

			$this.animate({height: height, opacity: 1}, 200);

			loader(option.key)
				.done(function(data) {
					$.each(data, function(i, item) {
						delete item.id;
						delete item.html;
					});
					option.data = data;

					$this
						.bind('fotorama:ready', function(e) {
							$this
								.animate({height: $this.children().height(), opacity: 1}, 200, function() {
									$this.css({height: ''});
								});
						})
						.fotorama(option);
				})
				.fail(function() {
					$this
						.text('エラー：スプレッドシートを読み込めません')
						.addClass('error')
						.removeClass('hidden');
				});
		});
	});
});
