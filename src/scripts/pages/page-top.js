'use strict';

var $ = require('jquery');

exports.rules = [
  /(?:)/
];

exports.callback = function() {
  var target = $('<a href="#" id="pagetop">PAGE TOP</a>');
  target.appendTo('body');

  var win = $(window);

  win.scroll(function() {
    var top = win.scrollTop();
    var client = document.documentElement.clientHeight;

    target.toggleClass('off', top < client);
  });

  win.scroll();
};
