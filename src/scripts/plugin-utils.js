var $ = require('jquery');

var pluginCache = [];

function Plugin(option) {
	this.option = option;
	this.name = option.name;
}

Plugin.prototype.run = function run(root, force) {
	var self = this;
	var callback = this.option.callback;
	var selector = '.' + this.name;

	if (!force)
		selector += ':not(.initialized)';

	$(root || document).find(selector).each(function() {
		var $this = $(this);
		var option = $.extend({}, self.option.defaults, parseOption($this));

		$this.empty();

		var result = callback.call(self, $this, option);

		if (result) {
			if (option.replace)
				$this.replaceWith(result);

			else
				$this.append(result);
		}

		$this.addClass('initialized');
	});
};

function parseOption(element) {
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

		options[key] = value;
	});

	return options;
}

function runAll(root, force) {
	pluginCache.forEach(function(plugin) {
		plugin.run(root, force);
	});
}

module.exports.parseOption = parseOption;

module.exports.registerPlugin = function registerPlugin(option) {
	var plugin = new Plugin(option);
	pluginCache.push(plugin);
	return plugin;
};

module.exports.runAll = runAll;

$(function() {
	runAll();
});
