'use strict';

(function() {
  var toastr = require('toastr');
  var plugins = require('./plugins');
  var pages = require('./pages');

  toastr.options.timeOut = 2000;

  require('./default');

  plugins.loadPlugins();
  pages.loadPages();
})();
