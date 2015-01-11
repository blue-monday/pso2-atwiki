'use strict';

var util = require('../plugin-utils');
var $ = require('jquery');
var Oppai = require('oppai.js');

util.registerPlugin({
  name: 'oppai',
  transform: function(key, value) {
    function getNumbers(str) {
      return str.match(/\d+/g).map(Number);
    }

    if (key === 'left_vertex' || key === 'right_vertex')
      value = getNumbers(value);

    else if (key === 'left_round_coords' || key === 'right_round_coords')
      value = value.match(/\d+\D+\d+/g).map(getNumbers);

    return value;
  },
  callback: function(element, option) {
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

    var oppai = new Oppai(canvas[0], option.image_url, {enableTouch: true}, left, right);
    oppai.load();

    var lastPos = 0;
    var $window = $(window);
    $window.scroll(function() {
      var pos = $window.scrollTop();
      var randX = Math.random() * 5;

      if (pos < lastPos)
        oppai.swing(randX, 80, 3000);

      else
        oppai.swing(randX, -80, 3000);

      lastPos = pos;
    });

    return canvas;
  }
});
