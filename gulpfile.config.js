'use strict';
var GulpConfig = (function () {
    function GulpConfig() {
        this.source = './src';
        this.scriptsPath = this.source + '/app';
        this.jsPath = this.source + '/js';
        this.jsConcatPath = this.source + '/jsconcat';
        this.allJavaScript = [this.source + '/js/**/*.js'];
        this.allTypeScript = this.scriptsPath + '/**/*.ts';

        this.typings = './tools/typings/';
        this.libraryTypeScriptDefinitions = './tools/typings/**/*.ts';
        this.appTypeScriptReferences = this.typings + 'typescriptApp.d.ts';
    }
    return GulpConfig;
})();
module.exports = GulpConfig;
