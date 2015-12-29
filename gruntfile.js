module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        haxe: {
            project: {
                hxml: "build.hxml"
            }
        },

        uglify: {
            options: {
                compress: {
                    drop_console: true
                },
                banner: "/*!" +
                        "\n * <%= pkg.name %> - v<%= pkg.version %>" +
                        "\n * Compiled on <%= grunt.template.today('dd-mm-yyyy hh:mm:ss') %>" +
                        "\n * <%= pkg.name %> is licensed under the MIT License." +
                        "\n * Copyright (c) 2015-2016 <%= pkg.author.name %>\n*/\n"
            },
            target: {
                files: {
                    "dist/waud.min.js": ["dist/waud.min.js"]
                }
            }
        },

        exec: {
            copy: "mkdir npm-publish || true && cp -r src dist sprite.js waudaudiosprite.js package.json LICENSE README.md ./npm-publish/",
            npm: "npm publish ./npm-publish/ && rm -r npm-publish"
        },

        zip: {
            "waud.zip": ["src/*", "sprite.js", "waudaudiosprite.js", "haxelib.json", "README.md", "LICENSE"]
        }
    });

    grunt.loadNpmTasks("grunt-haxe");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-zip");
    grunt.loadNpmTasks("grunt-exec");
    grunt.registerTask("default", ["haxe", "uglify"]);
    grunt.registerTask("dist", ["uglify"]);
};