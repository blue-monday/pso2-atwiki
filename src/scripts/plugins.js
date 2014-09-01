define('plugin-utils', ['jquery'], {
	parseOption: function(element, clean) {
		var options = {};
		var reg = /([\w$_-]+)[:：][ 　]*("(?:\\"|[^"])*"|.*[^\s　]|)/;

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

			else if (/^"[^"]*"$/.test(value))
				value = value.slice(1, -1).replace(/\\(.)/g, '$1');

			options[key] = value;
		});

		if (clean)
			element.empty();

		return options;
	}
});

requirejs(['plugins/iframe']);
requirejs(['plugins/gallery']);

define({});
