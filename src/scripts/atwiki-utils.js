'use strict';

var $ = require('jquery');

var currentPage = location.pathname.replace(/^\/[^/]+\/?/, '');
var isLoggedIn = !!$('#globalNavRight a[href*="/logout/"]').length;

exports.currentPage = currentPage;
exports.isLoggedIn = isLoggedIn;
