'use strict';

var $ = require('jquery');
var ZeroClipboard = require('zeroclipboard');
var toastr = require('toastr');

// deamdify does not work...
require('jquery-ui/ui/core');
require('jquery-ui/ui/widget');
require('jquery-ui/ui/mouse');
require('jquery-ui/ui/position');
require('jquery-ui/ui/draggable');
require('jquery-ui/ui/resizable');

module.exports = function() {
  ZeroClipboard.config({
    title: 'クリップボードにコピー',
    forceHandCursor: true,
    debug: false
  });

  var btn = $('<a/>').addClass('youtube-popup-link glyphicon glyphicon-film');

  $(function() {
    $('#wikibody a[href*="youtube.com"]').each(function(i) {
      var $this = $(this);
      var videoid = $this.attr('href').replace(/.+?\bv=|&.*/g, '');
      var playerid = 'youtube-popup-' + i;

      btn.clone()
        .attr('href', 'https://www.youtube.com/v/' + videoid + '?rel=0&enablejsapi=1&playerapiid=' + playerid)
        .attr('title', '「' + $this.text() + '」をここで再生')
        .attr('data-playerid', playerid)
        .attr('data-popup-title', $this.text())
        .insertAfter($this);
    });
  });

  /* global onYouTubePlayerReady:true */
  if (typeof onYouTubePlayerReady === 'function')
    var _onYouTubePlayerReady = onYouTubePlayerReady;

  onYouTubePlayerReady = function(playerid) {
    $('#' + playerid).trigger('youtube:playerready', [playerid]);

    if (_onYouTubePlayerReady)
      _onYouTubePlayerReady.apply(this, arguments);
  };

  $(document)
  .on('click', '.youtube-popup-link', onPopupLinkClick)
  .on('youtube:playerready', '.youtube-popup', toggleTimerecorder)
  .on('dblclick', '.youtube-popup-titlebar', function() {
    $(this).closest('.youtube-popup').toggleClass('collapse-video');
  })
  .on('click', '.youtube-popup-titlebar-buttons .btn-timerecorder', toggleTimerecorder)
  .on('click', '.youtube-popup-titlebar-buttons .btn-openprev', openNextPrev)
  .on('click', '.youtube-popup-titlebar-buttons .btn-opennext', openNextPrev)
  .on('click', '.youtube-popup-titlebar-buttons .btn-closepopup', closePopup)
  .on('click', '.youtube-popup-timerecorder td.link', onRecordButtonClick)
  .on('focus click', '.youtube-popup-timerecorder .format', function() {
    $(this).select();
  });

  function onPopupLinkClick(event) {
    // jshint validthis:true
    event.preventDefault();

    var $this = $(this).blur();
    var playerid = $this.attr('data-playerid');

    /* global alert */
    if ($('#' + playerid).length) {
      alert('同じ動画は2つ以上同時に開けません');
      return;
    }

    var objectWrapper = $('<div/>')
      .addClass('youtube-popup-videowrapper');

    var object = $('<object/>')
      .attr('type', 'application/x-shockwave-flash')
      .attr('data', $this.attr('href'))
      .attr('id', playerid)
      .appendTo(objectWrapper);

    $.each({
      allowscriptaccess: 'always',
      allowfullscreen: 'true',
      movie: $this.attr('href'),
      wmode: 'opaque'
    }, function(name, value) {
      $('<param/>')
        .attr('name', name)
        .attr('value', value)
        .appendTo(object);
    });

    openPopup({
      title: $this.attr('data-popup-title'),
      content: objectWrapper,
      anchorElement: $this
    });
  }

  function openPopup(option) {
    var popup = $('<div/>')
      .addClass('youtube-popup');

    var titlebar = $('<div/>')
      .addClass('youtube-popup-titlebar')
      .text(option.title);

    var buttons = $('<div/>')
      .addClass('youtube-popup-titlebar-buttons');

    var toggletr = $('<span/>')
      .addClass('youtube-popup-titlebar-button btn-timerecorder glyphicon glyphicon-time')
      .attr('title', 'タイムレコーダー');

    var prev = $('<span/>')
      .addClass('youtube-popup-titlebar-button btn-openprev glyphicon glyphicon-fast-backward')
      .attr('title', '前の動画');

    var next = $('<span/>')
      .addClass('youtube-popup-titlebar-button btn-opennext glyphicon glyphicon-fast-forward')
      .attr('title', '次の動画');

    var close = $('<span/>')
      .addClass('youtube-popup-titlebar-button btn-closepopup glyphicon glyphicon-remove')
      .attr('title', '閉じる');

    var content = $('<div/>')
      .addClass('youtube-popup-content')
      .append(option.content);

    var timerecorder = $('<div/>')
      .addClass('youtube-popup-timerecorder')
      .hide();

    var trfooter = $('<div/>')
      .addClass('youtube-popup-timerecorder-footer');

    var table = $('<table/>');
    var thead = $('<thead><tr><th></th><th>wave1</th><th>wave2</th><th>wave3</th><th>wave4</th><th>wave5</th><th>wave6</th></tr></thead>');
    var tbody = $('<tbody/>');
    var tr1 = $('<tr><th>開始時刻</th></tr>');
    var tr2 = $('<tr><th>終了時刻</th></tr>');
    var tr3 = $('<tr><th>所要時間</th></tr>');

    table.append(thead, tbody);
    tbody.append(tr1, tr2, tr3);

    for (var i = 1; i <= 6; i++) {
      $('<td/>')
        .text('0:00')
        .addClass('link')
        .attr('data-col', i)
        .appendTo([tr1, tr2]);

      $('<td/>')
        .addClass('lap')
        .attr('data-col', i)
        .appendTo(tr3);
    }

    timerecorder
      .append(table)
      .append(trfooter);

    var clip = $('<span/>')
      .addClass('clip glyphicon glyphicon-paperclip')
      .appendTo(trfooter);

    var format = $('<input type="text"/>')
      .addClass('format')
      .appendTo(trfooter);

    var zclip = new ZeroClipboard(clip);

    zclip.on('ready', function() {
      clip.addClass('ready');
    });

    zclip.on('copy', function() {
      var val = format.val();
      if (val)
        this.setText(val + '\n');
    });

    zclip.on('aftercopy', function() {
      toastr.success('コピーしました');
    });

    popup.append(titlebar, content, timerecorder);
    titlebar.append(buttons);
    buttons.append(toggletr, prev, next, close);

    popup
      .appendTo(document.body)
      .position({
        my: 'left top',
        at: 'left top',
        of: option.anchorElement,
        collision: 'fit'
      })
      .resizable({
        handles: 'e, w'
      })
      .draggable({
        snap: 'html, .youtube-popup',
        stack: '.youtube-popup',
        handle: '.youtube-popup-titlebar',
        cancel: '.youtube-popup-titlebar-buttons',
        iframeFix: true,
        start: function() {
          // jQuery UI 1.11.2 changes (#7772) set an annoying css height.
          // Remove it to keep auto.
          setTimeout(function() {
            popup.css({height: ''});
          }, 0);
        }
      })
      .animate({width: 640}, 200);

    return popup;
  }

  function onRecordButtonClick() {
    // jshint validthis:true
    var $this = $(this);
    var popup = $this.closest('.youtube-popup');
    var object = popup.find('object');
    var t = Math.round(object.get(0).getCurrentTime());
    $this.text(secondsToTime(t)).attr('data-seconds', t);

    var colIndex = $this.attr('data-col');
    var cells = $this.closest('tbody').find('td[data-col="' + colIndex + '"]');

    var t0 = cells.eq(0).attr('data-seconds');
    var t1 = cells.eq(1).attr('data-seconds');
    if (!t0 || !t1)
      return;

    t = t1 - t0;
    if (t < 0)
      t = 0;

    cells.eq(2).attr('data-seconds', t).text(secondsToTime(t));

    var titlebar = popup.find('.youtube-popup-titlebar');
    var text = '|' + titlebar.text().replace(/\D+/g, '').slice(-1) + '回目|';

    var totalSeconds = 0;
    var timerecorder = $this.closest('.youtube-popup-timerecorder');
    timerecorder.find('.lap').each(function(i, cell) {
      cell = $(cell);
      text += cell.text() + '|';
      totalSeconds += cell.attr('data-seconds') | 0;
    });
    text += secondsToTime(totalSeconds) + '|';
    timerecorder.find('.format').val(text);
  }

  function toggleTimerecorder() {
    // jshint validthis:true
    var popup = $(this);
    if (!popup.is('.youtube-popup'))
      popup = popup.closest('.youtube-popup');

    if (popup.length)
      popup.find('.youtube-popup-timerecorder').slideToggle(200);
  }

  function openNextPrev() {
    // jshint validthis:true
    var $this = $(this);
    var diff = $this.hasClass('btn-opennext') ? 1 : -1;
    var popup = $this.closest('.youtube-popup');
    var nextPlayerid = popup.find('object').attr('id').replace(/\d+$/, function(d) { return +d + diff; });
    var link = $('a[data-playerid="' + nextPlayerid + '"]');
    if (!link.length) {
      alert('動画がありません');
      return;
    }
    link.click();
    $('#' + nextPlayerid).closest('.youtube-popup').offset(popup.offset());
    popup.remove();
  }

  function closePopup() {
    // jshint validthis:true
    $(this).closest('.youtube-popup').remove();
  }

  function secondsToTime(t) {
    var m = t / 60 | 0;
    var s = t % 60;

    return m + ':' + String(100 + s).substring(1);
  }
};
