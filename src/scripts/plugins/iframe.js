define(['jquery', 'plugin-utils'], function($, util) {
	var defaults = {
		width: 500,
		height: 300
	};

	$(function() {
		$('.user-iframe').each(function() {
			var $this = $(this);
			var iframe = $('<iframe/>')
				.addClass($this.attr('class'))
				.removeClass('user-iframe');

			var option = $.extend({}, defaults, util.parseOption($this));
			$.each(option, $.proxy(iframe, 'attr'));

			if ($this.hasClass('replace')) {
				$this.replaceWith(iframe);
			} else {
				$this.empty().append(iframe);
			}
		});
	});
});
