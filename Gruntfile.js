
module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-connect');

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

        connect: {
            serve: {
                options: {
                    port: 8080,
                    protocol: 'http',
                    base: 'dist',
                    useAvailablePort: true
                }
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

    grunt.registerTask('default', ['build']);

    grunt.registerTask('build', ['build:client'])

    grunt.registerTask('build:client', 'Build the client application', [
        'clean:tmp',
        'clean:dist',
        'babel:client',
        'browserify:client',
        'copy:client'
    ]);

    grunt.registerTask('serve', 'Stand up a web server to serve application', [
        'build',
        'connect:serve:keepalive'
    ]);
};
