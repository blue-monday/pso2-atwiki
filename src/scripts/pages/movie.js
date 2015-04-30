'use strict';

exports.rules = [
  'pages/21.html',
  'pages/57.html',
  'pages/71.html'
];

exports.callback = function() {
  require('../timecolorbar')();
  require('../youtubepopup')();
};
