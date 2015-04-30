'use strict';

var $ = require('jquery');

exports.replace = true;
exports.defaults = {
  width: 500,
  height: 300
};

exports.callback = function(element, option) {
  var iframe = $('<iframe/>')
    .addClass(element.attr('class'))
    .removeClass(this.name);

  $.each(option, $.proxy(iframe, 'attr'));

  return iframe;
};
