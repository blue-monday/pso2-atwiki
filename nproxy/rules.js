var path = require('path');

module.exports = [{
	pattern: /^https?:\/\/rawgit\.com\/blue-monday\/pso2(?:-atwiki)?\/master\/dist\//,
	responder: path.join(__dirname, '../dist')
}];
