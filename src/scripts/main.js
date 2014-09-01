requirejs(['jquery']);

(function($) {
	var currentPage = location.pathname.replace(/^\/[^/]+\/?/, '');

	// main.js
	if (currentPage === 'pages/45.html') {
		requirejs(['pages/ignore']);
		return;
	}

	requirejs(['default']);
	requirejs(['plugins']);

	// トップ
	if ($.inArray(currentPage, ['', 'pages/15.html']))
		requirejs(['pages/top']);

	// 動画倉庫
	else if ($.inArray(currentPage, ['pages/21.html', 'pages/57.html', 'pages/71.html']))
		requirejs(['pages/movie']);

	// 緊急募集
	else if (currentPage === 'pages/50.html')
		requirejs(['pages/bbs']);

})(jQuery);

define({});
