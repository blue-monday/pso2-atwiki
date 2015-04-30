'use strict';

var $ = require('jquery');

exports.rules = [
  /(?:)/
];

exports.callback = function() {
  var timer = setInterval(function() {
    var js = $('#menubar a[href$="/45.html"]');
    if (!js.length)
      return;

    js.closest('li').remove();
    clearInterval(timer);
  }, 100);

  setTimeout(function() {
    clearInterval(timer);
  }, 3000);
};
