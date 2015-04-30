'use strict';

var $ = require('jquery');
require('sticky-kit');

exports.rules = [
  /(?:)/
];

exports.callback = function() {
  $(function() {
    $('.plugin_contents').stick_in_parent({
      'offset_top': 20
    });

    setTimeout(function() {
      $('body').triggerHandler('sticky_kit:recalc');
    }, 0);
  });
};
