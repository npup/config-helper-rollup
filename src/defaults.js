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


const defaultTsOptions = {

};
const defaultHtmlTemplateOptions = {
    template: "index.html",
    page: "index.html",
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


const defaultStylesOptions = {
    autoModules: /.+\.module\..+/,
    extract: true,
    sourceMap: true,
    // minify: (will default to main prop "minify")
};


module.exports = {
    defaultOptions,
    defaultHtmlTemplateOptions,
    defaultDevserverOptions,
    defaultSvelteOptions,
    defaultJsxOptions,
    defaultStylesOptions,
    defaultTsOptions,
};
