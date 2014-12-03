(function($) {
	var currentPage = location.pathname.replace(/^\/[^/]+\/?/, '');

	// main.js
	if (currentPage === 'pages/45.html') {
		require('./pages/ignore')();
		return;
	}

	require('./default')();
	require('./all-plugins')();

	$.each([
		// トップ
		[['', 'pages/15.html'], require('./pages/top')],

		// 緊急募集
		[['pages/50.html'], require('./pages/bbs')],

		// 動画倉庫
		[['pages/21.html', 'pages/57.html', 'pages/71.html'], require('./pages/movie')],

	], function(i, rule) {
		if (~$.inArray(currentPage, rule[0])) {
			rule[1]();
			return true;
		}
	});

})(require('jquery'));
