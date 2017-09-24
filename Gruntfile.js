/* global module:false */
module.exports = function(grunt) {
  var port = grunt.option('port') || 8000;
  var base = grunt.option('base') || '.';

  // Project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner:
        '/*!\n' +
        ' * reveal.js <%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd, HH:MM") %>)\n' +
        ' * http://lab.hakim.se/reveal-js\n' +
        ' * MIT licensed\n' +
        ' *\n' +
        ' * Copyright (C) 2015 Hakim El Hattab, http://hakim.se\n' +
        ' */'
    },

    qunit: {
      files: [ 'reveal.js/test/*.html' ]
    },

    uglify: {
      options: {
        banner: '<%= meta.banner %>\n'
      },
      build: {
        src: 'reveal.js/js/reveal.js',
        dest: 'reveal.js/js/reveal.min.js'
      }
    },

    sass: {
      options: {
        sourceMap: true,
      },
      core: {
        files: {
          'reveal.js/css/reveal.css': 'reveal.js/css/reveal.scss',
        }
      },
      themes: {
        files: [
          {
            expand: true,
            cwd: 'reveal.js/css/theme/source',
            src: ['*.scss'],
            dest: 'reveal.js/css/theme',
            ext: '.css'
          }
        ]
      }
    },

    postcss: {
      options: {
        processors: [
          require('autoprefixer-core')({browsers: ['last 3 version']})
        ]
      },
      dist: {
        src: 'reveal.js/css/reveal.css'
      }
    },

    jshint: {
      options: {
        curly: false,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        eqnull: true,
        browser: true,
        expr: true,
        globals: {
          head: false,
          module: false,
          console: false,
          unescape: false,
          define: false,
          exports: false
        }
      },
      files: [ 'Gruntfile.js', 'reveal.js/js/reveal.js' ]
    },

    connect: {
      server: {
        options: {
          port: port,
          base: base,
          livereload: true,
          open: true
        }
      }
    },

    zip: {
      'reveal-js-presentation.zip': [
        'index.html',
        'reveal.js/css/**',
        'reveal.js/js/**',
        'reveal.js/lib/**',
        'reveal.js/images/**',
        'reveal.js/plugin/**'
      ]
    },

    watch: {
      options: {
        livereload: true
      },
      js: {
        files: [ 'Gruntfile.js', 'reveal.js/js/reveal.js' ],
        tasks: 'js'
      },
      theme: {
        files: [ 'reveal.js/css/theme/source/*.scss', 'reveal.js/css/theme/template/*.scss' ],
        tasks: 'css-themes'
      },
      css: {
        files: [ 'reveal.js/css/reveal.scss', 'reveal.js/css/partials/*.scss' ],
        tasks: 'css-core'
      },
      html: {
        files: [ '*.html', 'reveal.js/*.html']
      }
    }

  });

  // Dependencies
  grunt.loadNpmTasks( 'grunt-contrib-qunit' );
  grunt.loadNpmTasks( 'grunt-contrib-jshint' );
  grunt.loadNpmTasks( 'grunt-contrib-uglify' );
  grunt.loadNpmTasks( 'grunt-contrib-watch' );
  grunt.loadNpmTasks( 'grunt-sass' );
  grunt.loadNpmTasks( 'grunt-contrib-connect' );
  grunt.loadNpmTasks( 'grunt-postcss' );
  grunt.loadNpmTasks( 'grunt-zip' );

  // Default task
  grunt.registerTask( 'default', [ 'css', 'js' ] );

  // JS task
  grunt.registerTask( 'js', [ 'jshint', 'uglify', 'qunit' ] );

  // Theme CSS
  grunt.registerTask( 'css-themes', [ 'sass:themes' ] );

  // Core framework CSS
  grunt.registerTask( 'css-core', [ 'sass:core', 'postcss' ] );

  // All CSS
  grunt.registerTask( 'css', [ 'sass', 'postcss' ] );

  // Package presentation to archive
  grunt.registerTask( 'package', [ 'default', 'zip' ] );

  // Serve presentation locally
  grunt.registerTask( 'serve', [ 'connect', 'watch' ] );

  // Run tests
  grunt.registerTask( 'test', [ 'jshint', 'qunit' ] );

};
