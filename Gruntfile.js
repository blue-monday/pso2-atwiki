'use strict';

var fs = require('fs');
var path = require('path');
var glob = require('glob');
var through = require('through');

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
          transform: [jquerify(['jquery-ui', 'fotorama', 'sticky-kit']), 'browserify-shim', 'debowerify']
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
            'bower_components/jquery-ui/themes/base/{core,draggable,resizable}.css',
            'bower_components/fotorama/fotorama.css',
            'bower_components/toastr/toastr.css'
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
          cwd: 'bower_components/bootstrap-sass/assets',
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
        files: ['*.js', 'src/scripts/{pages/,}*.js', '!src/scripts/all-plugins.js'],
        tasks: ['jshint', 'browserify']
      },
      plugins: {
        files: ['src/scripts/plugins/*.js'],
        tasks: ['jshint', 'plugin-require', 'browserify']
      }
    },

    concurrent: {
      build: ['build_js', 'build_css']
    }
  });

  grunt.registerTask('plugin-require', function() {
    var dir = 'src/scripts';
    var files = glob.sync(dir + '/plugins/*.js');
    var reqs = files.map(function(file) {
      return 'require(\'' + file.replace(dir, '.') + '\');';
    });
    var body = '\'use strict\';\n\n// Auto generated. See grunt "plugin-require" task.\n' + reqs.join('\n') + '\n';
    var filename = path.join(dir, 'all-plugins.js');
    fs.writeFileSync(filename, body);

    console.log('File "' + filename + '" created.');
  });

  grunt.registerTask('build', [
    'jshint',
    'clean',
    'concurrent:build',
    'copy:dist'
  ]);

  grunt.registerTask('build_js', [
    'plugin-require',
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

  function jquerify(rules) {
    return function(file) {
      var filename = file.replace(/\\/g, '/');

      var matched = rules.some(function(rule) {
        return rule instanceof RegExp && rule.test(filename) || ~filename.indexOf(rule);
      });

      if (!matched)
        return through();

      var stream = through(write, end);
      var data = ';(function(__ojq__, __jq__) {\nwindow.jQuery = window.$ = __jq__;\n';

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
};
