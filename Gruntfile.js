'use strict';

module.exports = function(grunt) {
  require('jit-grunt')(grunt, {
    sass_imports: 'grunt-scss-imports'
  });
  require('time-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    githooks: {
      setup: {
        'pre-commit': 'git-pre-commit'
      }
    },

    clean: {
      dist: {
        files: {
          src: 'dist/*'
        }
      }
    },

    jshint: {
      options: {
        jshintrc: true,
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          '*.js',
          'src/**/*.js'
        ]
      }
    },

    browserify: {
      dist: {
        options: {
          exclude: ['./lib-cov/wrappers.js'],
          transform: [
            'browserify-shim',
            'debowerify',
            'require-globify'
          ]
        },
        files: {
          'dist/scripts/main.js': ['src/scripts/main.js']
        }
      }
    },

    uglify: {
      dist: {
        options: {
          sourceMap: false
        },
        files: {
          'dist/scripts/main.js': ['dist/scripts/main.js']
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
            'node_modules/jquery-ui/themes/base/jquery.ui.{core,resizable}.css',
            'node_modules/fotorama/fotorama.css',
            'node_modules/toastr/toastr.css'
          ]
        }
      }
    },

    sass: {
      options: {
        unixNewlines: true
      },
      dist: {
        options: {
          sourcemap: 'none',
          style: 'compressed'
        },
        files: {
          'dist/styles/main.css': [
            'src/styles/main.scss'
          ]
        }
      },
      dev: {
        files: {
          'dist/styles/main.css': [
            'src/styles/main.scss'
          ]
        }
      }
    },

    autoprefixer: {
      options: {
        browsers: ['last 2 version']
      },
      file: {
        expand: true,
        flatten: true,
        src: 'dist/styles/*.css',
        dest: 'dist/styles/'
      },
    },

    copy: {
      dist: {
        files: [{
          expand: true,
          cwd: 'node_modules/fotorama',
          src: ['*.png'],
          dest: 'dist/styles'
        }, {
          expand: true,
          cwd: 'src/styles',
          src: ['*.{gif,jpg,png}'],
          dest: 'dist/styles'
        }, {
          expand: true,
          cwd: 'node_modules/zeroclipboard/dist',
          src: ['*.swf'],
          dest: 'dist/scripts'
        }, {
          expand: true,
          cwd: 'node_modules/bootstrap-sass/assets',
          src: ['fonts/**'],
          dest: 'dist'
        }]
      }
    },

    watch: {
      styles: {
        files: ['src/styles/*.scss'],
        tasks: ['sass:dev', 'autoprefixer']
      },
      scripts: {
        files: ['*.js', 'src/scripts/**/*.js'],
        tasks: ['jshint', 'browserify']
      },
      plugins: {
        files: ['src/scripts/plugins/*.js'],
        tasks: ['jshint', 'browserify']
      }
    },

    concurrent: {
      build: ['build_js', 'build_css']
    }
  });

  grunt.registerTask('build', [
    'jshint',
    'clean',
    'concurrent:build',
    'copy:dist'
  ]);

  grunt.registerTask('build_js', [
    'browserify',
    'uglify'
  ]);

  grunt.registerTask('build_css', [
    'sass_imports',
    'sass:dist',
    'autoprefixer'
  ]);

  grunt.registerTask('git-pre-commit', [
    'jshint'
  ]);

  grunt.registerTask('default', [
    'build'
  ]);
};
