'use strict';

(function() {
  var plugins = require('./plugins');
  var pages = require('./pages');

  var toastr = require('toastr');
  toastr.options.timeOut = 2000;

  require('./default');

  pages.loadPages();
  plugins.loadPlugins();
})();
