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
const { mergeDefaults } = require("./util");

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
const resolvePath = (_path, base = "./") => {
    return path.resolve(base, _path);
};


function Conf(name, options = {}) {
    if (!(this instanceof Conf)) {
        return new Conf(name, options);
    }
    if ("string" != typeof name && name) {
        throw Error("name is mandatory");
    }

    let {
        src, dist, entry, sourcemap, minify: globalMinify, production,
        devServer, htmlTemplate, styles, svelte, jsx, ts,
    } = { ...defaultOptions, ...options };

    // base options
    const baseOptions = { src, dist, entry, sourcemap, globalMinify, production };

    // result object
    const result = { name, ...baseOptions, };

    // creator of chaining utility option functions
    const createChainedSetter = (prop, _defaults) => {
        return this[prop] = (options = true, defaults = _defaults) => {
            result[prop] = mergeDefaults(options, defaults);
            return this;
        };
    };

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
    if (devServer) {
        handleDevServer(devServer, defaultDevserverOptions);
    }
    if (htmlTemplate) {
        handleHtmlTemplate(htmlTemplate, defaultHtmlTemplateOptions);
    }
    if (styles) {
        handleStyles(styles, defaultStylesOptions);
    }
    if (svelte) {
        handleSvelte(svelte, defaultSvelteOptions);
    }
    if (jsx) {
        handleJsx(jsx, defaultJsxOptions);
    }
    if (ts) {
        handleTs(ts, defaultTsOptions);
    }

    this.result = result;

    let { production: productionEnvProperty } = result;
    let isProduction = !!productionEnvProperty;

    if ("string" == typeof productionEnvProperty) {
        isProduction = "development" != process.env[productionEnvProperty];
    }

    //  minify: use explicit setting or heed isProduction flag
    if ("boolean" != typeof globalMinify) {
        result.globalMinify = globalMinify = isProduction;
    }


    this.peek = () => {
        return result;
    };

    this.get = () => {

        // js bundle
        const jsIn = resolvePath(`${ result.src }/${ result.entry }`);
        const jsOut = resolvePath(`${ result.dist }/${ result.name }.js`);


        // devserver
        let serveDir;
        if (result.devServer) {
            serveDir = resolvePath(result.dist);
        }

        // plugins
        const resolveDedupe = [];
        if (result.svelte) {
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
                [productionEnvProperty]: JSON.stringify(process.env[productionEnvProperty]),
            }),
            commonjsPlugin(),
        ];

        // html template
        if (result.htmlTemplate) {
            const htmlIn = resolvePath(`${ src }/${ result.htmlTemplate.template }`);
            const htmlOut = resolvePath(`${ dist }/${ result.htmlTemplate.page }`);
            const x = {
                template: htmlIn,
                target: htmlOut,
            };
            plugins.push(htmlTemplatePlugin(x));
        }

        // styles
        if (result.styles) {
            const x = {
                ...result.styles,
            };
            plugins.push(stylesPlugin(x));
        }

        // svelte
        if (result.svelte) {
            let { cssFileBaseName = result.name } = result.svelte;
            const x = svelte = {
                ...defaultSvelteOptions,
                dev: !isProduction,
                preprocess: autoPreprocess(),
                css(styles) {
                    // TODO: can we somehow inject this as a <link rel=""> into a html template if wanted?
                    styles.write(`${ result.dist }/${ cssFileBaseName }.svelte.css`);
                },
            };
            plugins.push(sveltePlugin(x));
        }

        // jsx/react
        if (result.jsx) {
            const x = {
                ...result.jsx,
                transforms: [ "jsx", ],
            };
            plugins.push(sucrasePlugin(x));
        }

        // ts
        if (result.ts) {
            const x = {
                ...result.ts,
                transforms: [ "typescript" ],
            };
            plugins.push(sucrasePlugin(x));
        }

        if (!isProduction) {
            if (result.devServer) {
                if (result.devServer.livereload) {
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

        if (result.globalMinify) {
            plugins.push(terserPlugin());
        }

        const rollupConf = {
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
            rollupConf.context = "window";
        }

        return rollupConf;
    };


    return this;
}


module.exports = {
    chr: Conf
};

