'use strict';

var $ = require('jquery');

var selectors = {
  option: '> div:first-child:not([class])'
};

module.exports = Plugin;

function Plugin(name, option) {
  if (!(this instanceof Plugin))
    return new Plugin(name, option);

  if (typeof name === 'string')
    option = $.extend({name: name}, option);

  else if (!(option instanceof Object))
    option = name;

  $.extend(this, option);
}

Plugin.prototype.run = function run(root, force) {
  var self = this;
  var selector = '.' + this.name;

  if (!force)
    selector += ':not(.initialized)';

  $(root || document).find(selector).each(function() {
    var $this = $(this);

    function except(e) {
      $this.addClass('error').text(e);
    }

    var option = {};

    if (!self.noOption) {
      try {
        option = self.parseOption($this);
      } catch (e) {
        except(e);
        return;
      }

      option = $.extend({}, self.defaults, option);

      if (!$.isEmptyObject(option))
        $this.find(selectors.option).remove();
    }

    var result;

    try {
      result = self.callback.call(self, $this, option);
    } catch (e) {
      except(e);
      return;
    }

    if (result) {
      if (self.replace)
        $this.replaceWith(result);

      else
        $this.append(result);
    }

    $this.addClass('initialized');
  });
};

Plugin.prototype.parseOption = function parseOption(element) {
  var self = this;
  var options = {};
  var reg = /([\w$_-]+)[:：][ 　]*("(?:\\"|[^"])*"|.*[^\s　]|)/;

  var lines = element.find(selectors.option).text().split('\n');

  lines.forEach(function(line) {
    var kv = reg.exec(line);

    if (!kv)
      return;

    var key = kv[1];
    if (!key)
      return;

    var value = kv[2];

    if (value === 'true' || value === 'false')
      value = value === 'true';

    else if (value === 'null')
      value = null;

    else if (!isNaN(value) && value)
      value = +value;

    else if (/^"(?:\\.|[^"])*"$/.test(value))
      value = value.slice(1, -1).replace(/\\(.)/g, '$1');

    if (typeof self.transform === 'function')
      value = self.transform(key, value, options);

    options[key] = value;
  });

  return options;
};

Plugin.prototype.activate = function activate(root, force) {
  $($.proxy(this, 'run', root, force));

  return this;
};

Plugin.loadPlugins = function loadPlugins(root, force) {
  var plugins = require('./plugins/*.js', {hash: true});

  return $.map(plugins, function(opts, name) {
    return new Plugin(name, opts).activate(root, force);
  });
};
