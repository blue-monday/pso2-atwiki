'use strict';

var $ = require('jquery');

exports.rules = [
  /(?:)/
];

exports.callback = function() {
  var ddsmoothmenu = window.ddsmoothmenu;
  if (!ddsmoothmenu)
    return;

  var style = $('<style>.ddsmoothmenu { display: none; }</style>').appendTo('head');
  var firstMenu = null;

  ddsmoothmenu.getajaxmenu = hook;
  ddsmoothmenu.buildmenu = hook;

  function hook(jq, options) {
    var id = options.mainmenuid;

    $('style').each(function() {
      var $this = $(this);
      if (~$this.text().indexOf('#' + id))
        $this.remove();
    });

    var wrapper = $('#' + id);

    wrapper.find('.downarrowclass')
      .remove();

    wrapper.find('*').addBack()
      .removeAttr('id')
      .removeAttr('class')
      .removeAttr('style');

    var ul = wrapper.find('> ul');

    ul.find('li:empty')
      .remove();

    ul.find('li').has('> ul')
      .addClass('hasmenu');

    if (firstMenu) {
      firstMenu.append(ul.children('li'));
      wrapper.remove();
    } else {
      wrapper.addClass('dropmenu-wrapper');
      initMenu(ul);
      firstMenu = ul;
      style.remove();
    }
  }

  function initMenu(ul) {
    ul.addClass('dropmenu');

    ul.on('click', '.hasmenu > a', function handleClick(event) {
      event.preventDefault();

      $(this).parent('.hasmenu').toggleClass('open')
        .find('.hasmenu.open').removeClass('open');
    });

    ul.on('mouseenter', '.hasmenu', function handleMouseEnter() {
      $(this).addClass('open');
    });

    ul.on('mouseleave', '.hasmenu', function handleMouseLeave() {
      $(this).removeClass('open');
    });
  }
};
