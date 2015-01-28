'use strict';

var $ = require('jquery');
require('cssua');
require('sticky-kit');

var wiki = require('./atwiki-utils');

// bodyclass
(function() {
  var currentPage = wiki.currentPage;
  var add = $.proxy($('body'), 'addClass');

  add(currentPage.replace(/\.html$/, '').replace(/\W/g, '-') || 'toppage');

  if (wiki.isLoggedIn)
    add('logged-in');

  else
    add('logged-out');
})();

// suppress ddsmoothmenu initialization
// and cleanup dom
(function() {
  var ddsmoothmenu = window.ddsmoothmenu;
  if (!ddsmoothmenu)
    return;

  var style = $('<style>.ddsmoothmenu { display: none; }</style>').appendTo('head');
  var firstMenu = null;

  ddsmoothmenu.getajaxmenu = hook;
  ddsmoothmenu.buildmenu = hook;

  function hook(jq, options) {
    var id = options.mainmenuid;

    jq('style').each(function() {
      var $this = jq(this);
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
})();

// hide main.js
(function() {
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
})();

// bootstrap
(function() {
  function init() {
    $('input[type="submit"]:not(.btn)').addClass('btn btn-primary');
    $('input[type="button"]:not(.btn), button:not(.btn)').addClass('btn btn-default');
  }

  $(function() {
    init();
    $(document).on('DOMNodeInserted', init);
  });
})();

// pagetop
(function() {
  var target = $('<a href="#" id="pagetop">PAGE TOP</a>');
  target.appendTo('body');

  var win = $(window);

  win.scroll(function() {
    var top = win.scrollTop();
    var client = document.documentElement.clientHeight;

    target.toggleClass('off', top < client);
  });

  win.scroll();
})();

// sticky kit
$(function() {
  $('.plugin_contents').stick_in_parent({
    'offset_top': 20
  });

  setTimeout(function() {
    $('body').triggerHandler('sticky_kit:recalc');
  }, 0);
});

// content scroll
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

// the command
(function() {
  var completed = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
  var inputs = new Array(completed.length);

  $(document).keydown(function(event) {
    var key = event.which;
    if (!key)
      return;

    inputs.push(key);
    inputs.shift();

    if (inputs.join(',') === completed.join(','))
      setTimeout(fire, 1000);
  });

  function fire() {
    if (fire.busy)
      return;

    fire.busy = true;

    var body = $('body');
    body.css({
      overflowX: 'hidden',
      WebkitFilter: 'invert(100%)',
      filter: 'invert(100%)'
    });

    var dulation = 10000;
    var hidding = true;

    function move() {
      if (!hidding)
        return;

      body.css({
        left: Math.random() * 100 - 50 + 'px',
        top: Math.random() * 100 - 50 + 'px'
      });

      setTimeout(move, 1000 / 10);
    }

    move();

    body.animate({opacity: '0'}, dulation, function() {
      body.css({
        left: '',
        top: '',
        WebkitFilter: ''
      });
      hidding = false;
    });
    body.delay(dulation / 2);
    body.animate({opacity: '1'}, 500, function() {
      body.css({overflow: ''});
      fire.busy = false;
    });
  }
})();
