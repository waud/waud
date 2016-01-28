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

        shell: {
            npm: {
                command: "mkdir npm-publish || true && cp -r src dist package.json LICENSE README.md ./npm-publish/ && npm publish ./npm-publish/ && rm -r npm-publish"
            },
            sample: {
                command: "cp ./dist/waud.min.js sample/ && cp -r ./sample/ ../adireddy.github.io/demos/waud/"
            }
        },

        zip: {
            "waud.zip": ["src/*", "haxelib.json", "README.md", "LICENSE"]
        },

        yuidoc: {
        compile: {
            name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                url: '<%= pkg.repository.url %>',
                options: {
                linkNatives: "true",
                    attributesEmit: "true",
                    selleck: "true",
                    extension: ".hx",
                    paths: "./src",
                    outdir: "../adireddy.github.io/docs/waud/",
                    themedir: "../adireddy.github.io/docs/yui/themes/yuidoc-theme-blue",
                    logo: "./sample/assets/logo.png"
            }
        }
    }
    });

    grunt.loadNpmTasks("grunt-haxe");
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks("grunt-zip");
    grunt.loadNpmTasks("grunt-shell");
    grunt.registerTask("default", ["haxe"]);
};