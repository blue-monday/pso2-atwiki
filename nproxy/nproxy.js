'use strict';

var path = require('path');
var rule = path.join(__dirname, 'rules.js');
var port = 5432;

require('nproxy')(port, {
  responderListFilePath: rule
});
