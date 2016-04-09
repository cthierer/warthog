
module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        babel: {
            options: {
                presets: ['es2015', 'react']
            },
            client: {
                files: {
                    '.tmp/client/app.js': 'client/app.js'
                }
            }
        },

        browserify: {
            client: {
                src: '.tmp/client/**/*.js',
                dest: 'dist/script.js'
            }
        },

        clean: {
            tmp: {
                src: ['.tmp/**/*.*']
            },
            dist: {
                src: ['dist/**/*.*']
            }
        },

        copy: {
            client: {
                files: [
                    {
                        expand: true,
                        cwd: 'client/',
                        src: ['index.html'],
                        dest: 'dist/'
                    }
                ]
            }
        }
    });

    grunt.registerTask('default', ['build:client']);

    grunt.registerTask('build:client', 'Build the client application', [
        'clean:tmp',
        'clean:dist',
        'babel:client',
        'browserify:client',
        'copy:client'
    ]);
};
