(function() {
	var $ = require('jquery');
	var wiki = require('./atwiki-utils');

	var currentPage = wiki.currentPage;

	// main.js
	if (currentPage === 'pages/45.html') {
		require('./pages/ignore')();
		return;
	}

	require('./default');
	require('./all-plugins');

	var routes = [
		[// トップ
			['', 'pages/15.html'],
			require('./pages/home')
		],

		[// 動画倉庫
			['pages/21.html', 'pages/57.html', 'pages/71.html'],
			require('./pages/movie')
		],
	];

	$.each(routes, function(i, rule) {
		if (~$.inArray(currentPage, rule[0]))
			rule[1]();
	});
})();
