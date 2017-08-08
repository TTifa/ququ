module.exports = function(grunt) {
    grunt.initConfig({
        nwjs: {
            options: {
                //platforms: ['win', 'osx'],
                platforms: ['win'],
                buildDir: './dist',
                version: '0.23.7',
                macIcns: "assets/osx/panda.icns",
                macPlist: {
                    "CFBundleIdentifier":"com.wangsuo.ququ",
                },
                winIco: "assets/win/panda.ico",
            },
            src: ['./app/**/*']
        }
    });

    grunt.loadNpmTasks('grunt-nw-builder');
}
