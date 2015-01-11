var path = require('path');

require('nproxy')(5432, {
	responderListFilePath: path.join(__dirname, 'rules.js')
});
