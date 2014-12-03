var $ = require('jquery');

module.exports = function() {
	var completed = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
	var inputs = Array(completed.length);

	$(document).keydown(function(event) {
		var key = event.which;
		if (!key)
			return;

		inputs.push(key);
		inputs.shift();

		if (inputs.join(',') === completed.join(','))
			setTimeout(fire, 1000);
	});

	function fire() {
		if (fire.busy)
			return;

		fire.busy = true;

		var body = $('body');
		body.css({
			overflowX: 'hidden',
			WebkitFilter: 'invert(100%)'
		});

		var dulation = 10000;
		var hidding = true;

		move();

		body.animate({opacity: '0'}, dulation, function() {
			body.css({
				left: '',
				top: '',
				WebkitFilter: ''
			});
			hidding = false;
		});
		body.delay(dulation / 2);
		body.animate({opacity: '1'}, 500, function() {
			body.css({overflow: ''});
			fire.busy = false;
		});

		function move() {
			if (!hidding)
				return;

			body.css({
				left: Math.random() * 100 - 50 + 'px',
				top: Math.random() * 100 - 50 + 'px'
			});

			setTimeout(move, 1000 / 10);
		}
	}
};
