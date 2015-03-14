module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    react: {
      combined_file_output: {
        files: {
          'build/<%= pkg.name %>.js': [
            'src/*.jsx'
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
        files: ['src/*.jsx'],
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
