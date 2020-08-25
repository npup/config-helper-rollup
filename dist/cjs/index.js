const path = require("path");

const sveltePlugin = require("rollup-plugin-svelte");
const autoPreprocess = require("svelte-preprocess");

const resolve = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");

const serve = require("rollup-plugin-serve");

const htmlTemplatePlugin = require("rollup-plugin-generate-html-template");
const liveReloadPlugin = require("rollup-plugin-livereload");
const { terser } = require("rollup-plugin-terser");

const stylesPlugin = require("rollup-plugin-styles");

const {
    defaultDevserverOptions,
    defaultHtmlTemplateOptions,
    defaultOptions,
    defaultStylesOptions,
    defaultSvelteOptions
} = require("../../src/defaults");

const defaults = {
    defaultDevserverOptions,
    defaultHtmlTemplateOptions,
    defaultOptions,
    defaultStylesOptions,
    defaultSvelteOptions
};

const f = require("../../src/config-helper-rollup");

module.exports.chr = f({
    path,
    sveltePlugin, autoPreprocess,
    resolve, commonjs,
    htmlTemplatePlugin, liveReloadPlugin, stylesPlugin,
    serve,
    terser,
    defaults,
});
