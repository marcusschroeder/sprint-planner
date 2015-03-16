module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    frontend_dir: 'frontend/src/**/*.jsx',

    react: {
      combined_file_output: {
        files: {
          'public/js/<%= pkg.name %>.js': [
            '<%= frontend_dir %>'
          ]
        }
      }
    },

    browserify: {
      options: {
        transform:  [ require('grunt-react').browserify ]
      },
      app: {
        src: 'build/combined.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },

    watch: {
      scripts: {
        files: ['<%= frontend_dir %>'],
        tasks: ['react'],
        options: {
          spawn: false
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-react');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['browserify']);

};
