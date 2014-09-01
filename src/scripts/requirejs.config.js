requirejs.config({
	paths: {
		'requirejs': '../../node_modules/grunt-contrib-requirejs/node_modules/requirejs/require',
		'zeroclipboard': '../../bower_components/zeroclipboard/dist/ZeroClipboard',
		'jquery': '../../bower_components/jquery/dist/jquery',
		'jquery-cookie': '../../bower_components/jquery-cookie/jquery.cookie',
		'sticky-kit': '../../bower_components/sticky-kit/jquery.sticky-kit',
		'fotorama': '../../bower_components/fotorama/fotorama',
		'jquery-ui': '../../bower_components/jquery-ui/ui/'
	},
	shim: {
		'jquery': {
			exports: 'jQuery'
		},
		'fotorama': {
			deps: ['jquery']
		}
	}
});
