'use strict';

require('cssua');

var toastr = require('toastr');
toastr.options.timeOut = 2000;

var pages = require('./pages');
var plugins = require('./plugins');

pages.loadPages();
plugins.loadPlugins();
