'use strict';

var $ = require('jquery');

var currentPage = location.pathname.replace(/^\/[^/]+\/?/, '');
var isLoggedIn = !!$('#globalNavRight a[href*="/logout/"]').length;

module.exports.currentPage = currentPage;
module.exports.isLoggedIn = isLoggedIn;
