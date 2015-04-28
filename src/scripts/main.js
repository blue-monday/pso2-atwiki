'use strict';

(function() {
  var toastr = require('toastr');
  var wiki = require('./atwiki-utils');
  var plugins = require('./plugins');

  var currentPage = wiki.currentPage;

  // main.js
  if (currentPage === 'pages/45.html') {
    require('./pages/ignore')();
    return;
  }

  toastr.options.timeOut = 2000;

  require('./default');

  plugins.loadPlugins();

  var routes = [
    [// トップ
      ['', 'pages/15.html'],
      require('./pages/home')
    ],

    [// 動画倉庫
      ['pages/21.html', 'pages/57.html', 'pages/71.html'],
      require('./pages/movie')
    ]
  ];

  routes.forEach(function(rule) {
    if (~rule[0].indexOf(currentPage))
      rule[1]();
  });
})();
