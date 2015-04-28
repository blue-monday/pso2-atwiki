'use strict';

var $ = require('jquery');
var w = require('wrappers');
var Oppai = require('oppai.js');

exports.transform = function(key, value) {
  function getNumbers(str) {
    return str.match(/\d+/g).map(Number);
  }

  try {
    if (key === 'left_vertex' || key === 'right_vertex')
      value = getNumbers(value);

    else if (key === 'left_round_coords' || key === 'right_round_coords')
      value = value.match(/\d+\D+\d+/g).map(getNumbers);

  } catch (e) {
    throw new Error(key + ' の指定が不正です\n例: right_vertex: (xx, yy)\nleft_round_coords: (xx, yy)(xx, yy)(xx, yy)');
  }

  return value;
};

exports.callback = function(element, option) {
  var canvas = $('<canvas/>');
  var left = null;
  var right = null;

  if (option.left_vertex && option.left_round_coords) {
    left = {
      vertex: option.left_vertex,
      round_coords: option.left_round_coords
    };
  }

  if (option.right_vertex && option.right_round_coords) {
    right = {
      vertex: option.right_vertex,
      round_coords: option.right_round_coords
    };
  }

  var oppOpt = {
    enableTouch: true
  };

  var oppai = new Oppai(canvas[0], option.image_url, oppOpt, left, right);
  oppai.load();

  var lastPos = 0;
  var $window = $(window);
  $window.scroll(w.throttle(function() {
    var pos = $window.scrollTop();
    var randX = (Math.random() * 11 | 0) - 5;

    if (pos < lastPos)
      oppai.swing(randX, 80, 3000);

    else
      oppai.swing(randX, -80, 3000);

    lastPos = pos;
  }, 200));

  return canvas;
};
