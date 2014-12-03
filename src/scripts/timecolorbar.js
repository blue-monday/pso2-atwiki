var $ = require('jquery');

module.exports = function() {
	$(function() {
		$('#wikibody > table').each(eachTable);
	});

};

function eachTable() {
	var $this = $(this);
	var totals = $this.find('td:last-child').map(function() {
		return getSeconds($(this).text());
	});
	totals = totals.toArray(); // IE
	totals.push(315); // 5m15s
	totals.push(175); // 2m55s
	var longer = Math.max.apply(null, totals);

	var wrapper = $('<div/>')
		.addClass('colorbar')
		.width($this.width());

	$('<div/>')
		.addClass('colorbar-cell cell-0')
		.width((315 / longer * 1000 | 0) / 10 + '%')
		.attr('title', '4周安全圏 (5:15)')
		.appendTo(wrapper)
		.wrap('<div class="colorbar-row"/>');

	$('<div/>')
		.addClass('colorbar-cell cell-0')
		.width((175 / longer * 1000 | 0) / 10 + '%')
		.attr('title', '5周安全圏 (3:00)')
		.appendTo(wrapper)
		.wrap('<div class="colorbar-row"/>');

	$this.find('tr:nth-child(n+2)').each(function(i) {
		var row = $('<div/>').addClass('colorbar-row');

		$(this).find('td:nth-child(n+2):not(:last-child)').each(function(j) {
			var time = $(this).text();
			var lap = getSeconds(time);

			$('<div/>')
				.addClass('colorbar-cell cell-' + (j + 1))
				.width((lap / longer * 1000 | 0) / 10 + '%')
				.attr('title', (i + 1) + '周目 wave' + (j + 1) + ' (' + time + ')')
				.appendTo(row);
		});
		row.appendTo(wrapper);
	});
	wrapper.insertAfter($this);
}

function getSeconds(ts) {
	var t = ts.split(':');
	if (!t[0])
		return 0;

	var m = +t[0];
	var s = +t[1];
	return m * 60 + s;
}
