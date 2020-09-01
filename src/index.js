const sveltePlugin = require("rollup-plugin-svelte");
const sucrasePlugin = require("@rollup/plugin-sucrase");
const { nodeResolve: nodeResolvePlugin } = require("@rollup/plugin-node-resolve");
const commonjsPlugin = require("@rollup/plugin-commonjs");
const servePlugin = require("rollup-plugin-serve");
const htmlTemplatePlugin = require("rollup-plugin-generate-html-template");
const liveReloadPlugin = require("rollup-plugin-livereload");
const { terser: terserPlugin } = require("rollup-plugin-terser");
const stylesPlugin = require("rollup-plugin-styles");
const replacePlugin = require("@rollup/plugin-replace");
const autoPreprocess = require("svelte-preprocess");

const { mergeDefaults, resolvePath } = require("./util");
const {
    defaultOptions,
    defaultDevserverOptions,
    defaultHtmlTemplateOptions,
    defaultStylesOptions,
    defaultSvelteOptions,
    defaultJsxOptions,
    defaultTsOptions,
} = require("./defaults");


const env = process.env.NODE_ENV;



function Conf(name, options = {}) {
    if (!(this instanceof Conf)) { return new Conf(name, options); }
    if ("string" != typeof name && name) { throw Error("name is mandatory"); }

    // extract options
    let {
        // base options
        src, dist, entry, sourcemap, minify: globalMinify, production,
        // plugin options
        devServer, htmlTemplate, styles, svelte, jsx, ts,
    } = { ...defaultOptions, ...options };

    // base options
    const baseOptions = { src, dist, entry, sourcemap, globalMinify, production };

    // creator of chaining utility option functions
    const createChainedSetter = (prop, _defaults) => {
        return this[prop] = (options = true, defaults = _defaults) => {
            settings[prop] = mergeDefaults(options, defaults);
            return this;
        };
    };

    // settings object
    const settings = { name, ...baseOptions, };

    // create chaining utility functions for each wanted type of settings
    const handleDevServer = createChainedSetter("devServer", defaultDevserverOptions);
    const handleHtmlTemplate = createChainedSetter("htmlTemplate", defaultHtmlTemplateOptions);
    const handleStyles = createChainedSetter("styles", defaultStylesOptions);
    const handleSvelte = createChainedSetter("svelte", defaultSvelteOptions);
    const handleJsx = createChainedSetter("jsx", defaultJsxOptions);
    const handleTs = createChainedSetter("ts", defaultTsOptions);

    // invoke options handler functions directly for any settings submitted upfront
    [
        [ "devServer", devServer, handleDevServer, defaultDevserverOptions, ],
        [ "htmlTemplate", htmlTemplate, handleHtmlTemplate, defaultHtmlTemplateOptions, ],
        [ "styles", styles, handleStyles, defaultStylesOptions, ],
        [ "svelte", svelte, handleSvelte, defaultSvelteOptions, ],
        [ "jsx", jsx, handleJsx, defaultJsxOptions, ],
        [ "ts", ts, handleTs, defaultTsOptions, ],
    ].forEach(([ name, type, handler, options ]) => {
        if (0) { console.log(`Using module: ${ name }: ${ !!type }`, { name, type: String(type), handler, options }); }
        if (type) { handler(type, options); }
    });


    if (devServer) { handleDevServer(devServer, defaultDevserverOptions); }
    if (htmlTemplate) { handleHtmlTemplate(htmlTemplate, defaultHtmlTemplateOptions); }
    if (styles) { handleStyles(styles, defaultStylesOptions); }
    if (svelte) { handleSvelte(svelte, defaultSvelteOptions); }
    if (jsx) { handleJsx(jsx, defaultJsxOptions); }
    if (ts) { handleTs(ts, defaultTsOptions); }


    // is runtime "production" or not?
    let { production: productionEnvProperty } = settings;
    // first, look at the sent in "production" property (turn to boolean)
    let isProduction = !!productionEnvProperty;
    // if it was in fact a string, use it is as property to look for in process.env
    // to determine if it is "development". If it is not - consider this "production mode".
    if ("string" == typeof productionEnvProperty) {
        isProduction = "development" != process.env[productionEnvProperty];
    }

    //  minify: use explicit setting or heed isProduction flag
    if ("boolean" != typeof globalMinify) {
        settings.globalMinify = isProduction;
    }

    settings.productionEnvProperty = productionEnvProperty;
    settings.isProduction = isProduction;

    this.settings = settings;
    return this;
}


Conf.prototype.data = function () {
    return this.settings;
};

Conf.prototype.end = function () {
    const { settings, } = this;
    const { productionEnvProperty, isProduction, } = settings;

    // js bundle
    const jsIn = resolvePath(`${ settings.src }/${ settings.entry }`);
    const jsOut = resolvePath(`${ settings.dist }/${ settings.name }.js`);

    // devserver
    let serveDir;
    if (settings.devServer) {
        serveDir = resolvePath(settings.dist);
    }

    /** build relevant plugin options and add them */

    // what to dedupe?
    const resolveDedupe = [];
    if (settings.svelte) {
        resolveDedupe.push("svelte");
    }

    // base plugins
    const plugins = [
        nodeResolvePlugin({
            browser: true,
            dedupe: resolveDedupe
        }),
        replacePlugin({
            "process.env.NODE_ENV": JSON.stringify(env),
            [`process.env.${ productionEnvProperty }`]: JSON.stringify(process.env[productionEnvProperty]),
        }),
        commonjsPlugin(),
    ];

    // html template
    if (settings.htmlTemplate) {
        const htmlIn = resolvePath(`${ settings.src }/${ settings.htmlTemplate.template }`);
        const htmlOut = resolvePath(`${ settings.dist }/${ settings.htmlTemplate.page }`);
        const options = {
            template: htmlIn,
            target: htmlOut,
        };
        plugins.push(htmlTemplatePlugin(options));
    }

    // styles
    if (settings.styles) {
        const options = {
            ...settings.styles,
        };
        plugins.push(stylesPlugin(options));
    }

    // svelte
    if (settings.svelte) {
        let { cssFileBaseName = settings.name } = settings.svelte;
        const options = {
            ...defaultSvelteOptions,
            dev: !isProduction,
            preprocess: autoPreprocess(),
            css(styles) {
                // TODO: can we somehow inject this as a <link rel=""> into a html template if wanted?
                styles.write(`${ settings.dist }/${ cssFileBaseName }.svelte.css`);
            },
        };
        plugins.push(sveltePlugin(options));
    }

    // jsx/react
    if (settings.jsx) {
        const options = {
            ...settings.jsx,
            transforms: [ "jsx", ],
        };
        plugins.push(sucrasePlugin(options));
    }

    // ts
    if (settings.ts) {
        const options = {
            ...settings.ts,
            transforms: [ "typescript" ],
        };
        plugins.push(sucrasePlugin(options));
    }

    if (!isProduction) {
        if (settings.devServer) {
            if (settings.devServer.livereload) {
                plugins.push(liveReloadPlugin());
            }

            plugins.push(
                // serve according to settings
                servePlugin({
                    port: settings.devServer.port,
                    contentBase: serveDir,
                    historyApiFallback: true,
                })
            );
        }
    }

    if (settings.globalMinify) {
        plugins.push(terserPlugin());
    }

    const rollupConf = {
        input: jsIn,
        output: {
            name: settings.name,
            file: jsOut,
            sourcemap: settings.sourcemap,
            format: "iife",
            assetFileNames: "[name][extname]",
        },
        watch: {
            clearScreen: false,
        },
        plugins,
    };

    if (settings.jsx) {
        // needed for react for some reason :/
        rollupConf.context = "window";
    }

    return rollupConf;
};




module.exports = {
    chr: Conf
};

