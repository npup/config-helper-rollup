const defaultOptions = {

    src: "./src",
    dist: "./dist",
    entry: "main.js",
    sourcemap: true,
    // minify: will default to whatever `isProduction` is determined to be (see "production" option)
    production: "NODE_ENV", // a hard boolean - OR  which node process.env property to look at. Any value but "development" will mean `isProduction = true`

    htmlTemplate: false,
    devServer: false,
    svelte: false,
    styles: false,
    ts: false,


};




const defaultStylesOptions = {
    autoModules: /.+\.module\..+/,
    extract: true,
    sourcemap: true,
    // minify: (will default to main prop "minify")
};


const defaultHtmlOptions = {
    template: "index.html",
    fileName: null, // will default to whatever `template` is
    publicPath: "",
    meta: [ { charset: "UTF-8", }, ],
};

const defaultDevserverOptions = {
    port: 3000,
    livereload: true,
};

const defaultSvelteOptions = {
    // cssFileBaseName: "<name>", // will default to "<name>" and in the end become => "<name>.svelte.css"
};

const defaultJsxOptions = {
};

const defaultTsOptions = {
};



module.exports = {
    defaultOptions,
    defaultDevserverOptions,
    defaultSvelteOptions,
    defaultJsxOptions,
    defaultStylesOptions,
    defaultTsOptions,
    defaultHtmlOptions,
};
