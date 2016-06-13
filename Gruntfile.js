module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        browserify: {
            lib: {
                files: {
                    'lib/stackblur.js': ['src/stackblur.js'],
                },
                options: {
                    browserifyOptions: {
                        'standalone': 'StackBlur'
                    }
                }
            }
        },

        uglify: {
            lib: {
                files: {
                    'lib/stackblur.min.js': ['lib/stackblur.js']
                }
            }
        }

    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task(s).
    grunt.registerTask('default', ['browserify', 'uglify']);

};
