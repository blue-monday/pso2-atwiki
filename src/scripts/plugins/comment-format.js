var util = require('../plugin-utils');
var $ = require('jquery');

var colors = {
	Hu: '#671313',
	Fi: '#6c1f52',
	Ra: '#142a7b',
	Gu: '#175b81',
	Fo: '#79761a',
	Te: '#674500',
	Br: '#006628',
	Bo: '#5b8300'
};

var keys = $.map(colors, function(v, k) {
	return k;
});

var colorsReg = new RegExp(keys.join('|'), 'g');

var readerBodyStyle = {
	color: '#f00',
	fontWeight: 'bold',
	textDecoration: 'underline'
};

var nameStyle = {
	display: 'inline-block',
	minWidth: '6em'
};

function eachComment(i) {
	var self = $(this);
	var arr = /^ *(.+?) +-- +(.+?) +\(([^(]+)\)$/.exec(self.html());
	if (!arr)
		return;

	var body = normChars(arr[1]);
	var name = arr[2];
	var date = arr[3];

	if (!i && body.lastIndexOf('↓', 0) === 0)
		body = $('<span/>').css(readerBodyStyle).html(body);

	else
		body = body.replace(colorsReg, spanClass);

	name = $('<span/>').css(nameStyle).html(name);

	self.empty();
	self.append('[', date, '] ', name, ' ', body);
}

function spanClass(cls) {
	return '<span style="background-color: ' + colors[cls] + '; color: #fff;">' + cls + '</span>';
}

function normChars(str) {
	// 全角
	str = str.replace(/[！-～]/g, function(s) {
		return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
	});

	// 空白
	str = str.replace(/[\u200b\u200c\u200d\ufeff\u2028\u2029\u00a0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000]/g, ' ');

	// ハイフン
	// str = str.replace(/[\u2212\uff0d\u30fc\u2012\u2013\u2014\u2015\u2500]/g, '-');

	return str;
}

util.registerPlugin({
	name: 'comment-format',
	noOption: true,
	callback: function(element) {
		element.find('ul').each(function() {
			$(this).find('li').each(eachComment);
		});
	}
});
