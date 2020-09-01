const path = require("path");

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

const env = process.env.NODE_ENV;

const resolvePath = (_path, base = "./") => {
    return path.resolve(base, _path);
};

const {
    defaultDevserverOptions,
    defaultHtmlTemplateOptions,
    defaultOptions,
    defaultStylesOptions,
    defaultSvelteOptions,
    defaultJsxOptions,
    defaultTsOptions,
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
        jsx,            // handle jsx compilation? boolean or settings
        styles,         // handle styles compilation? boolean or settings
        ts,             // handle ts compilation? boolean or settings

        minify: globalMinify, // crunch file output? boolean or...

    } = options;

    //  minify: use explicit setting or heed isProduction flag
    if ("boolean" != typeof globalMinify) {
        globalMinify = isProduction;
    }

    const info = {
        "App name": name,
        "Production mode": isProduction,
        "Dist": dist,
        "Generate source maps:": sourcemap,
        "Minify (main prop)": globalMinify,
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

        // minify as told to, OR do as top prop says
        let { minify } = styles;
        if ("boolean" != typeof styles.minify) {
            minify = globalMinify;
        }
        styles = options.styles = {
            ...styles,
            mode,
            minimize: minify,
        };
    }

    if (htmlTemplate) {
        if ("boolean" == typeof htmlTemplate) {
            htmlTemplate = {};
        }
        htmlTemplate = options.htmlTemplate = { ...defaultHtmlTemplateOptions, ...htmlTemplate };
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
            svelte = {};
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


    if (jsx) {
        if ("boolean" == typeof jsx) {
            jsx = {};
        }
        jsx = options.jsx = {
            ...defaultJsxOptions,
            ...jsx,
            transforms: [ "jsx", ],
        };
    }

    if (ts) {
        if ("boolean" == typeof ts) {
            ts = {};
        }
        ts = options.ts = {
            ...defaultTsOptions,
            ...ts,
            transforms: [ "typescript" ],
        };
    }
    // console.table(info);

    // js bundle
    const jsIn = resolvePath(`${ src }/${ entry }`);
    const jsOut = resolvePath(`${ dist }/${ name }.js`);
    // html template

    if (options.htmlTemplate) {
        const htmlIn = resolvePath(`${ src }/${ options.htmlTemplate.template }`);
        const htmlOut = resolvePath(`${ dist }/${ options.htmlTemplate.page }`);
        options.htmlTemplate = {
            template: htmlIn,
            target: htmlOut,
        };
    }

    // devserver
    let serveDir;
    if (options.devServer) {
        serveDir = resolvePath(dist);
    }

    /**
     * plugins
     * */
    const resolveDedupe = [];
    if (options.svelte) {
        resolveDedupe.push("svelte");
    }
    const plugins = [
        nodeResolvePlugin({
            browser: true,
            dedupe: resolveDedupe
        }),
        replacePlugin({
            "process.env.NODE_ENV": JSON.stringify(env),
            [productionEnvProperty]: JSON.stringify(process.env[productionEnvProperty]),
        }),
        commonjsPlugin(),
    ];

    if (options.styles) {
        plugins.push(stylesPlugin(options.styles));
    }
    if (options.svelte) {
        plugins.push(sveltePlugin(options.svelte));
    }
    if (options.jsx) {
        plugins.push(sucrasePlugin(jsx));
    }
    if (options.ts) {
        plugins.push(sucrasePlugin(ts));
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
                servePlugin({
                    port: devServer.port,
                    contentBase: serveDir,
                    historyApiFallback: true,
                })
            );
        }
    }

    if (globalMinify) {
        plugins.push(terserPlugin());
    }

    const result = {
        input: jsIn,
        output: {
            name,
            file: jsOut,
            sourcemap,
            format: "iife",
            assetFileNames: "[name][extname]",
        },
        watch: {
            clearScreen: false,
        },
        plugins,
    };

    if (options.jsx) {
        // needed for react for some reason :/
        result.context = "window";
    }

    result.__proto__ = {
        get meta() {
            return {
                author: "P. Envall!",
                date: new Date,
            };
        }
    }
    return result;

};

module.exports = { chr };
