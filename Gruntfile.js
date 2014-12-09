var fs = require('fs');
var glob = require('glob');
var through = require('through');

module.exports = function (grunt) {
	'use strict';

	require('load-grunt-tasks')(grunt);
	require('time-grunt')(grunt);

	function globalJQ(rules) {
		return function(file) {
			var filename = file.replace(/\\/g, '/');

			var matched = rules.some(function(rule) {
				if (rule instanceof RegExp && rule.test(filename) || typeof rule === 'string' && ~filename.indexOf(rule))
					return true;
			});

			if (!matched)
				return through();

			var data = ';(function(__ojq__, __jq__) {\nwindow.jQuery = window.$ = __jq__;\n';
			var stream = through(write, end);

			function write(buf) {
				data += buf;
			}

			function end() {
				data += '\n;window.jQuery = window.$ = __ojq__;\n}).call(window, window.jQuery, require(\'jquery\'));';
				stream.queue(data);
				stream.queue(null);
			}

			return stream;
		};
	}

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		githooks: {
			setup: {
				'pre-commit': 'git-pre-commit'
			}
		},

		jshint: {
			options: {
				reporter: require('jshint-stylish')
			},
			all: {
				src: [
					'.jshintrc',
					'*.js',
					'src/**/*.js'
				]
			}
		},

		uglify: {
			dist: {
				options: {
					sourceMap: true
				},
				files: {
					'dist/scripts/main.js': ['dist/scripts/main.js']
				}
			}
		},

		browserify: {
			dist: {
				options: {
					transform: [globalJQ(['jquery-ui', 'fotorama', 'sticky-kit']), 'browserify-shim', 'debowerify']
				},
				files: {
					'dist/scripts/main.js': ['src/scripts/main.js']
				}
			}
		},

		watch: {
			styles: {
				files: ['src/styles/*.scss'],
				tasks: ['sass']
			},
			scripts: {
				files: ['*.js', 'src/scripts/{pages/,}*.js', '!src/scripts/all-plugins.js'],
				tasks: ['jshint', 'browserify']
			},
			plugins: {
				files: ['src/scripts/plugins/*.js'],
				tasks: ['plugin-require', 'jshint', 'browserify']
			}
		},

		clean: {
			dist: {
				files: {
					src: 'dist'
				}
			}
		},

		sass_imports: {
			options: {
				banner: ''
			},
			dist: {
				files: {
					'src/styles/_imports.scss': [
						'bower_components/jquery-ui/themes/base/{core,draggable,resizable}.css',
						'bower_components/fotorama/fotorama.css',
						'bower_components/toastr/toastr.css'
					]
				}
			}
		},

		sass: {
			options: {
				style: 'compressed'
			},
			dist: {
				files: {
					'dist/styles/main.css': [
						'src/styles/main.scss'
					]
				}
			}
		},

		copy: {
			dist: {
				files: [{
					expand: true,
					cwd: 'bower_components/fotorama',
					src: ['*.png'],
					dest: 'dist/styles'
				}, {
					expand: true,
					cwd: 'src/styles',
					src: ['*.{gif,jpg,png}'],
					dest: 'dist/styles'
				}, {
					expand: true,
					cwd: 'bower_components/zeroclipboard/dist',
					src: ['*.swf'],
					dest: 'dist/scripts'
				}, {
					expand: true,
					cwd: 'bower_components/bootstrap-sass-official/assets',
					src: ['fonts/**'],
					dest: 'dist'
				}]
			}
		}
	});

	grunt.registerTask('plugin-require', function() {
		var dir = 'src/scripts';
		var files = glob.sync(dir + '/plugins/*.js');
		var reqs = files.map(function(file) {
			return 'require(\'' + file.replace(dir, '.') + '\');';
		});
		var body = '// Auto generated. See grunt task.\n' + reqs.join('\n') + '\n';
		fs.writeFileSync(dir + '/all-plugins.js', body);

		console.log('Done.');
	});

	grunt.registerTask('build', [
		'jshint',
		'clean',
		'plugin-require',
		'browserify',
		'uglify',
		'sass_imports',
		'sass',
		'copy:dist'
	]);

	grunt.registerTask('git-pre-commit', [
		'jshint'
	]);

	grunt.registerTask('default', [
		'build',
	]);
};
