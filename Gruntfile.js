module.exports = function (grunt) {
	'use strict';

	require('load-grunt-tasks')(grunt);
	require('time-grunt')(grunt);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		githooks: {
			setup: {
				'pre-commit': 'git-pre-commit'
			}
		},

		jshint: {
			all: {
				src: [
					'.jshintrc',
					'*.js',
					'src/**/*.js'
				]
			}
		},

		requirejs: {
			options: {
				mainConfigFile: 'src/scripts/requirejs.config.js',
				optimize: 'uglify2',
				preserveLicenseComments: false,
				generateSourceMaps: true,
				name: 'main',
				include: ['requirejs'],
				out: 'dist/scripts/main.js'
			},
			dist: {
			}
		},

		watch: {
			styles: {
				files: ['src/styles/*.scss'],
				tasks: ['sass']
			},
			scripts: {
				files: ['*.js', 'src/**/*.js'],
				tasks: ['jshint', 'requirejs']
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
						'bower_components/fotorama/fotorama.css'
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

	grunt.registerTask('build', [
		'jshint',
		'clean',
		'requirejs',
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
