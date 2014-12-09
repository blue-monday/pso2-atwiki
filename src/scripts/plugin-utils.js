var $ = require('jquery');

var selectors = {
	option: '> div:first-child:not([class])'
};
var plugins = [];

module.exports.plugins = plugins;
module.exports.parseOption = parseOption;
module.exports.registerPlugin = registerPlugin;
module.exports.runAll = runAll;

function Plugin(option) {
	this.option = option;
	this.name = option.name;
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

		if (!self.option.noOption) {
			try {
				option = parseOption($this, self.option.transform);
			} catch (e) {
				except(e);
				return;
			}

			option = $.extend({}, self.option.defaults, option);

			if (hasProperty(option))
				$this.find(selectors.option).remove();
		}

		var result;

		try {
			result = self.option.callback.call(self, $this, option);
		} catch (e) {
			except(e);
			return;
		}

		if (result) {
			if (self.option.replace)
				$this.replaceWith(result);

			else
				$this.append(result);
		}

		$this.addClass('initialized');
	});
};

function hasProperty(obj) {
	for (var p in obj)
		return true;

	return false;
}

function parseOption(element, transform) {
	var options = {};
	var reg = /([\w$_-]+)[:：][ 　]*("(?:\\"|[^"])*"|.*[^\s　]|)/;

	var lines = element.find(selectors.option).text().split('\n');

	$.each(lines, function(i, line) {
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

		if (typeof transform === 'function')
			value = transform(key, value, options);

		options[key] = value;
	});

	return options;
}

function registerPlugin(option) {
	var plugin = new Plugin(option);
	plugins.push(plugin);

	$(function() {
		plugin.run();
	});

	return plugin;
}

function runAll(root, force) {
	plugins.forEach(function(plugin) {
		plugin.run(root, force);
	});
}
