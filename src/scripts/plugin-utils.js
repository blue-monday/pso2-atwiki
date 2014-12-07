var $ = require('jquery');

var pluginCache = [];

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
		var option;

		function except(e) {
			$this.addClass('error').text(e);
		}

		try {
			option = parseOption($this, self.option.transform);
		} catch (e) {
			except(e);
			return;
		}

		$this.empty();
		option = $.extend({}, self.option.defaults, option);

		var result;

		try {
			result = self.option.callback.call(self, $this, option);
		} catch (e) {
			except(e);
			return;
		}

		if (result) {
			if (option.replace)
				$this.replaceWith(result);

			else
				$this.append(result);
		}

		$this.addClass('initialized');
	});
};

function parseOption(element, transform) {
	var options = {};
	var reg = /([\w$_-]+)[:：][ 　]*("(?:\\"|[^"])*"|.*[^\s　]|)/;

	// atwiki structure
	element.children('div').contents().each(function(i, node) {
		if (node.nodeType !== 3)
			return;

		var kv = reg.exec(node.data);

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
	pluginCache.push(plugin);
	return plugin;
}

function runAll(root, force) {
	pluginCache.forEach(function(plugin) {
		plugin.run(root, force);
	});
}

module.exports.parseOption = parseOption;
module.exports.registerPlugin = registerPlugin;
module.exports.runAll = runAll;

$(function() {
	runAll();
});
