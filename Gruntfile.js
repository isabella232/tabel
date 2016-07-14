/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const babelify = require( "babelify" );
const glslify = require( "glslify" );
const path = require( "path" );

const isWindows = /^win/.test( process.platform );

function appenginePath( program ) {
    return isWindows ?
        path.join(
            process.env.HOME, "AppData", "Local", "Google",
            "Cloud SDK", "google-cloud-sdk", "bin", program
        ) :
        path.join( process.env.HOME, "Applications", "google_appengine", program );
}

module.exports = function( grunt ) {

    grunt.initConfig( {

        clean: [ "out" ],

        appengine: {
            app: {
                root: "out",
                manageScript: appenginePath( "appcfg.py" ),
                runScript: appenginePath( "dev_appserver.py" ),
                runFlags: {
                    port: 8080,
                    host: "0.0.0.0"
                }
            }
        },

        browserify: {
            options: {
                transform: [
                    [
                        babelify,
                        {
                            "presets": [ "es2015" ],
                            "plugins": [
                                [ "transform-react-jsx", { "pragma": "h" } ]
                            ]
                        }
                    ],
                    glslify
                ]
            },
            dev: {
                options: {
                    watch: true,
                    keepAlive: true
                },
                files: {
                    "out/static/app.js": [ "js/main.js" ],
                    "out/static/polyfill.js": [ "js/polyfill.js" ]
                }
            },
            build: {
                files: {
                    "out/static/app.js": [ "js/main.js" ],
                    "out/static/polyfill.js": [ "js/polyfill.js" ]
                }
            }
        },

        uglify: {
            build: {
                files: {
                    "out/static/app.js": "out/static/app.js",
                    "out/static/polyfill.js": "out/static/polyfill.js"
                }
            }
        },

        sass: {
            dev: {
                options: {
                    outputStyle: "expanded"
                },
                files: {
                    "out/static/main.css": "scss/main.scss"
                }
            },
            build: {
                options: {
                    outputStyle: "compressed"
                },
                files: {
                    "out/static/main.css": "scss/main.scss"
                }
            }
        },

        copy: {
            source: {
                cwd: "src/",
                dest: "out/",
                expand: true,
                src: "**"
            },
            static: {
                cwd: "static",
                dest: "out/static/",
                expand: true,
                src: "**"
            },
            templates: {
                cwd: "templates",
                dest: "out/templates/",
                expand: true,
                src: "**"
            },
            yaml: {
                src: "app.yaml.base",
                dest: "out/app.yaml"
            }
        },

        watch: {
            source: {
                files: "src/**",
                tasks: [ "copy:source" ]
            },
            static: {
                files: "static/**",
                tasks: [ "copy:static" ]
            },
            templates: {
                files: "templates/**",
                tasks: [ "copy:templates" ]
            },
            styles: {
                files: "scss/**",
                tasks: [ "sass:dev" ],
                options: {
                    livereload: true
                }
            },
            yaml: {
                files: "app.yaml.base",
                task: [ "copy:yaml" ]
            }
        },

        concurrent: {
            dev: {
                tasks: [ "browserify:dev", "watch", "appengine:run:app" ],
                options: {
                    logConcurrentOutput: true
                }
            }
        }
    });

    require( "load-grunt-tasks" )( grunt );

    grunt.registerTask( "server", function() {
        /* eslint no-invalid-this: "off" */
        this.async();

        const express = require( "express" );
        const app = express();

        app.use( function( request, response, next ) {
            response.setHeader( "Access-Control-Allow-Origin", "*" );
            next();
        } );

        app.use( express.static( "out/static" ) );

        app.listen( 8081, function() {
            console.log( "asset server running on 8081" );
        } );
    } );

    grunt.registerTask( "default", [
        "clean",
        "copy:source",
        "copy:static",
        "copy:templates",
        "copy:yaml",
        "browserify:build",
        "sass:dev"
    ] );

    grunt.registerTask( "build", [
        "clean",
        "copy:source",
        "copy:static",
        "copy:templates",
        "copy:yaml",
        "browserify:build",
        "uglify",
        "sass:build"
    ] );

    grunt.registerTask( "dev", [ "default", "concurrent" ] );
};
