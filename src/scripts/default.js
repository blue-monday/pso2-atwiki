// bodyclass
requirejs(['jquery'], function($) {
	var currentPage = location.pathname.replace(/^\/[^/]+\/?/, '');
	var add = $.proxy($('body'), 'addClass');

	add(currentPage.replace(/\.html$/, '').replace(/\W/g, '-') || 'toppage');

	if ($('#globalNavRight a[href*="/logout/"]').length)
		add('logged-in');

	else
		add('logged-out');
});

// hide js
requirejs(['jquery'], function($) {
	var timer = setInterval(function() {
		var js = $('#menubar a[title*=".js "]');
		if (!js.length)
			return;

		js.closest('li').remove();
		clearInterval(timer);
	}, 100);

	setTimeout(function() {
		clearInterval(timer);
	}, 3000);
});

// bootstrap
requirejs(['jquery'], function($) {
	function init() {
		$('input[type="submit"]:not(.btn)').addClass('btn btn-primary');
		$('input[type="button"]:not(.btn), button:not(.btn)').addClass('btn btn-default');
	}

	$(function() {
		init();
		$(document).bind('DOMNodeInserted', init);
	});
});

// pagetop
requirejs(['jquery'], function($) {
	var shown = 0;

	var styles = [
		{bottom: '-120px', opacity: 0},
		{bottom: '20px', opacity: 1}
	];

	var link = $('<a href="#" id="pagetop">PAGE TOP</a>')
		.css(styles[shown])
		.appendTo('body');

	var win = $(window);
	win.scroll(function() {
		var top = win.scrollTop();
		var client = document.documentElement.clientHeight;
		if (shown && client <= top || !shown && top < client)
			return;

		shown ^= 1;
		link.stop().animate(styles[shown], 200);
	});
	win.scroll();
});

// sticky kit
requirejs(['jquery', 'sticky-kit'], function($) {
	$(function() {
		$('.plugin_contents').stick_in_parent({
			offset_top: 20
		});
		setTimeout(function() {
			$('body').triggerHandler('sticky_kit:recalc');
		}, 0);
	});
});

// content scroll
requirejs(['jquery'], function($) {
	$(function() {
		$('.plugin_contents a').map(function() {
			var $this = $(this);

			var href = $this.attr('href').split(/(?=#)/);
			if (location.href.lastIndexOf(href[0], 0) === 0)
				$this.attr('href', href[1]);
		});

		$(document).delegate('a[href^="#"]', 'click', function(event) {
			event.preventDefault();

			var href = $(this).attr('href');
			var y = href === '#' || href === '#top' ? 0 : $(href).offset().top;

			$('html, body').animate({scrollTop: y});
		});
	});
});

// the command
requirejs(['the_command']);

define({});
