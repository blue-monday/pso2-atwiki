var $ = require('jquery');
var gsx = /^gsx\$/;

module.exports = load;
load.load = load;

function load(key, callback) {
	var url = 'http://www.corsproxy.com/spreadsheets.google.com/feeds/list/' + key + '/od6/public/values?alt=json&callback=?';

	return $.getJSON(url).then(function(data) {
		var rows = [];

		$.each(data.feed.entry, function(i, entry) {
			var item = {};
			$.each(entry, function(key, value) {
				if (!gsx.test(key))
					return;

				item[key.replace(gsx, '')] = value.$t;
			});
			rows.push(item);
		});

		if (typeof callback === 'function')
			callback(rows);

		return rows;
	});
}
