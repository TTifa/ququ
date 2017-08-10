module.exports = function(grunt) {
    grunt.initConfig({
        nwjs: {
            options: {
                platforms: ['osx64'],
                buildDir: './dist',
                version: '0.23.7',
                macIcns: "assets/osx/panda.icns",
                macPlist: {
                    "CFBundleIdentifier":"com.wangsuo.ququ",
                }
            },
            src: ['./app/**/*']
        },

        zip: {
          'osx64': {
            src: ["dist/ququ/osx64/ququ.app/**"],
            dest: 'dist/ququ/ququ_osx.zip',
            compression: 'DEFLATE',
            cwd: 'dist/ququ/osx64/'
          }
        },

        appdmg: {
            options: {
                title: 'ququ',
                icon: 'assets/osx/panda.icns',
                background: 'assets/osx/background.png',
                'icon-size': 128,
                contents: [
                    { "x": 438, "y": 344, "type": "link", "path": "/Applications" },
                    { "x": 192, "y": 344, "type": "file", path: "dist/ququ/osx64/ququ.app" }
                ]
            },
            target: {
                dest: 'dist/ququ/osx64/ququ.dmg'
            }
        }
    });

    grunt.loadNpmTasks('grunt-zip');

    grunt.loadNpmTasks('grunt-nw-builder');

    grunt.loadNpmTasks('grunt-appdmg');

}
