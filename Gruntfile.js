'use strict';

module.exports = function (grunt) {
	require('load-grunt-tasks')(grunt);
	require('time-grunt')(grunt);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		githooks: {
			options: {
				startMarker: '## GRUNT-GRUNTHOOKS START',
				endMarker: '## GRUNT-GRUNTHOOKS END'
			},
			setup: {
				'pre-commit': 'git-pre-commit'
			}
		},

		requirejs: {
			options: {
				mainConfigFile: 'src/scripts/requirejs.config.js',
				name: 'main',
				include: ['requirejs'],
				out: 'dist/scripts/main.js'
			},
			dev: {
				options: {
					optimize: 'none'
				}
			},
			dist: {
			}
		},

		watch: {
			styles: {
				files: 'src/styles/*.scss',
				tasks: ['sass']
			},
			scripts: {
				files: 'src/scripts/{,**/}*.js',
				tasks: ['requirejs:dev']
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
		'clean',
		'requirejs:dist',
		'sass_imports',
		'sass',
		'copy:dist'
	]);

	grunt.registerTask('git-pre-commit', [
		'build'
	]);

	grunt.registerTask('default', [
		'build',
	]);
};
