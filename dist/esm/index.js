import path from "path";

import sveltePlugin from "rollup-plugin-svelte";
import autoPreprocess from "svelte-preprocess";

import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

import serve from "rollup-plugin-serve";

import htmlTemplatePlugin from "rollup-plugin-generate-html-template";
import liveReloadPlugin from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";

import stylesPlugin from "rollup-plugin-styles";

import {
    defaultDevserverOptions,
    defaultHtmlTemplateOptions,
    defaultOptions,
    defaultStylesOptions,
    defaultSvelteOptions
} from "./defaults";

const defaults = {
    defaultDevserverOptions,
    defaultHtmlTemplateOptions,
    defaultOptions,
    defaultStylesOptions,
    defaultSvelteOptions
};

import f from "../../src/config-helper-rollup";

export const chr = f({
    path,
    sveltePlugin, autoPreprocess,
    resolve, commonjs,
    htmlTemplatePlugin, liveReloadPlugin, stylesPlugin,
    serve,
    terser,
    defaults,
});
