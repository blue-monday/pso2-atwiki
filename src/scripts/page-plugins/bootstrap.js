'use strict';

var $ = require('jquery');

exports.rules = [
  /(?:)/
];

exports.callback = function() {
  function init() {
    $('input[type="submit"]:not(.btn)').addClass('btn btn-primary');
    $('input[type="button"]:not(.btn), button:not(.btn)').addClass('btn btn-default');
  }

  $(function() {
    init();
    $(document).on('DOMNodeInserted', init);
  });
};
