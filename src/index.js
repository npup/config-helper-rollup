const path = require("path");

const sveltePlugin = require("rollup-plugin-svelte");
const autoPreprocess = require("svelte-preprocess");

const { nodeResolve } = require('@rollup/plugin-node-resolve');
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
} = require("./defaults");


const chr = (name, options = {}) => {
    options = { ...defaultOptions, ...options };

    let { production: productionEnvProperty } = options;
    let isProduction = !!productionEnvProperty;
    if ("string" == typeof productionEnvProperty) {
        isProduction = "development" != process.env[productionEnvProperty];
    }

    let {
        // basic options
        src, dist,      // input/output directories
        entry,          // entry point (file name) for javascript

        sourcemap,      // generate js source maps?

        htmlTemplate,   // use html template? boolean or settings
        devServer,      // start a development server? boolean or settings
        svelte,         // handle svelte compilation? boolean or settings
        styles,         // handle styles compilation? boolean or settings

        minimize: globalMinimize, // crunch file output? boolean or...

    } = options;

    //  minimize: use explicit setting or heed isProduction flag
    if ("boolean" != typeof globalMinimize) {
        globalMinimize = isProduction;
    }

    const info = {
        "App name": name,
        "Production mode": isProduction,
        "Dist": dist,
        "Generate source maps:": sourcemap,
        "Minimize (main prop)": globalMinimize,
    };


    if (styles) {
        if ("boolean" == typeof styles) {
            styles = {};
        }

        styles = options.styles = { ...defaultStylesOptions, ...styles };

        // transform the "extract" prop to this api
        const { extract } = styles;
        const mode = extract ?
            [ "extract" ] :
            [ "inject" ];
        delete styles.extract;

        // minimize as told to, OR do as top prop says
        let { minimize } = styles;
        if ("boolean" != typeof styles.minimize) {
            minimize = globalMinimize;
        }
        styles = options.styles = {
            ...styles,
            mode,
            minimize,
        };
    }

    if (htmlTemplate) {
        if ("boolean" == typeof htmlTemplate) {
            htmlTemplate = {};
        }
        htmlTemplate = options.htmlTemplate = { ...defaultHtmlTemplateOptions, ...htmlTemplate, };
    }
    if (devServer) {
        if ("boolean" == typeof devServer) {
            devServer = {};
        }
        devServer = options.devServer = { ...defaultDevserverOptions, ...devServer, };
        info["Port"] = devServer.port;
        info["Use livereload"] = devServer.livereload;
    }

    if (svelte) {
        if ("boolean" == typeof svelte) {
            svelte = { ...defaultSvelteOptions, };
        }
        let { cssFileBaseName = name } = svelte;
        svelte = {
            ...defaultSvelteOptions,
            dev: !isProduction,
            preprocess: autoPreprocess(),
            css(styles) {
                // TODO: can we somehow inject this as a <link rel=""> into a html template if wanted?
                styles.write(`${ dist }/${ cssFileBaseName }.svelte.css`);
            },
        };
        options.svelte = svelte;
    }
    console.table(info);

    // js bundle
    const jsIn = path.resolve("./", `${ src }/${ entry }`);
    const jsOut = path.resolve("./", `${ dist }/${ name }.js`);
    // html template

    if (options.htmlTemplate) {

        const htmlIn = path.resolve("./", `${ src }/${ options.htmlTemplate.template }`);
        const htmlOut = path.resolve("./", `${ dist }/${ options.htmlTemplate.page }.html`);
        options.htmlTemplate = {
            template: htmlIn,
            target: htmlOut,
        };
    }

    // devserver
    let serveDir;
    if (options.devServer) {
        serveDir = path.resolve("./", dist);
    }

    /**
     * plugins
     * */
    const resolveDedupe = [];
    if (options.svelte) {
        resolveDedupe.push("svelte");
    }
    const plugins = [
        nodeResolve({
            browser: true,
            dedupe: resolveDedupe
        }),
        commonjs(),
    ];

    if (options.styles) {
        plugins.push(stylesPlugin(options.styles));
    }

    if (options.svelte) {
        plugins.push(sveltePlugin(options.svelte));
    }
    if (options.htmlTemplate) {
        plugins.push(htmlTemplatePlugin(options.htmlTemplate));
    }

    if (!isProduction) {
        if (options.devServer) {
            if (options.devServer.livereload) {
                plugins.push(liveReloadPlugin());
            }

            plugins.push(
                // serve according to settings
                serve({
                    port: devServer.port,
                    contentBase: serveDir,
                    historyApiFallback: true,
                })
            );
        }
    }

    if (globalMinimize) {
        plugins.push(terser());
    }

    const result = {
        input: jsIn,
        output: {
            name,
            format: "iife",
            file: jsOut,
            sourcemap,
            assetFileNames: "[name][extname]",
        },
        watch: {
            clearScreen: false,
        },
        plugins,
    };

    return result;

};

module.exports = { chr };
