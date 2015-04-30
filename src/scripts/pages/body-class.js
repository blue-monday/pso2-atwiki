'use strict';

var $ = require('jquery');
var wiki = require('../atwiki-utils');

exports.rules = [
  /(?:)/
];

exports.callback = function() {
  var currentPage = wiki.currentPage;
  var add = $.proxy($('body'), 'addClass');

  add(currentPage.replace(/\.html$/, '').replace(/\W/g, '-') || 'toppage');

  if (wiki.isLoggedIn)
    add('logged-in');

  else
    add('logged-out');
};
