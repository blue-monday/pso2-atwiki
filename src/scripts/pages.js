'use strict';

var $ = require('jquery');
var wiki = require('./atwiki-utils');

var pages = require('./page-plugins/*.js', {hash: true});

module.exports = Page;

function Page(name, option) {
  if (!(this instanceof Page))
    return new Page(name, option);

  if (typeof name === 'string')
    option = $.extend({name: name}, option);

  else if (!(option instanceof Object))
    option = name;

  $.extend(this, option);

  this.init();
}

Page.prototype.init = function() {
  if (!this.rules)
    this.rules = [];

  if (!Array.isArray(this.rules))
    this.rules = [this.rules];
};

Page.prototype.test = function(current) {
  current += '';

  return this.rules.some(function(rule) {
    if (rule && typeof rule.test === 'function')
      return rule.test(current);

    return rule === current;
  });
};

Page.prototype.run = function run() {
  var currentPage = wiki.currentPage;

  if (this.test(currentPage))
    this.callback.apply(this, arguments);

  return this;
};

Page.loadPages = function loadPages() {
  return $.map(pages, function(opts, name) {
    return new Page(name, opts).run();
  });
};
