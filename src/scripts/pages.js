'use strict';

var $ = require('jquery');
var wiki = require('./atwiki-utils');

module.exports = Page;

function Page(name, option) {
  if (!(this instanceof Page))
    return new Page(name, option);

  if (typeof name === 'string')
    option = $.extend({name: name}, option);

  else if (!(option instanceof Object))
    option = name;

  $.extend(this, option);
}

Page.prototype.run = function run() {
  var currentPage = wiki.currentPage;

  if (~this.rules.indexOf(currentPage))
    this.callback.apply(this, arguments);

  return this;
};

Page.loadPages = function loadPages() {
  var pages = require('./pages/*.js', {hash: true});

  return $.map(pages, function(opts, name) {
    return new Page(name, opts).run();
  });
};
