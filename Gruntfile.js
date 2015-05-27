module.exports = function (grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    frontend_dir: 'frontend/src/**/*.jsx',

    bower: {
      dev: {
        dest: 'public/js/libs',
        options: {
          packageSpecific: {
            'react': {
              files: [
                'react.min.js'
              ]
            },
            'jquery': {
              keepExpandedHierarchy: false,
              files: [
                'dist/jquery.min.js'
              ],
            }
          }
        }
      }
    },

    react: {
      combined_file_output: {
        files: {
          'public/js/<%= pkg.name %>.js': [
            '<%= frontend_dir %>'
          ]
        }
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
  grunt.loadNpmTasks('grunt-bower');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('init', ['bower', 'react']);

};
