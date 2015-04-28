'use strict';

var $ = require('jquery');

var proxy = 'http://crossorigin.me/';
var gsx = /^gsx\$/;

module.exports = load;

function load(key, callback) {
  var url = proxy + 'https://spreadsheets.google.com/feeds/list/' + key + '/od6/public/values?alt=json&callback=?';

  return $.getJSON(url).then(function(data) {
    var rows = data.feed.entry.map(parseRow);

    if (typeof callback === 'function')
      callback(rows);

    return rows;
  });
}

function parseRow(entry) {
  var row = {};

  for (var key in entry)
    if (gsx.test(key))
      row[key.replace(gsx, '')] = entry[key].$t;

  return row;
}
