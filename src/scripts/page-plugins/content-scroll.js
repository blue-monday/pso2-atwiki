'use strict';

var $ = require('jquery');

exports.rules = [
  /(?:)/
];

exports.callback = function() {
  $(document).on('click', 'a[href^="#"]', function(event) {
    event.preventDefault();

    var href = $(this).attr('href');
    var y = href === '#' || href === '#top' ? 0 : $(href).offset().top;

    $('html, body').animate({scrollTop: y});
  });

  $(function() {
    $('.plugin_contents a').map(function() {
      var $this = $(this);

      var href = $this.attr('href').split(/(?=#)/);
      if (location.href.lastIndexOf(href[0], 0) === 0)
        $this.attr('href', href[1]);
    });
  });
};
