export const defaultOptions = {

    src: "./src",
    dist: "./dist",
    entry: "main.js",

    sourcemap: true,

    htmlTemplate: false,
    devServer: false,
    svelte: false,
    styles: false,

    // minimize: will default to whatever `isProduction` is determined to be (see "production" option)

    production: "NODE_ENV", // a hard boolean - OR  which node process.env property to look at. Any value but "development" will mean `isProduction = true`
};


export const defaultHtmlTemplateOptions = {
    template: "index.html",
    page: "index",
};


export const defaultDevserverOptions = {
    port: 3000,
    livereload: true,
};

export const defaultSvelteOptions = {
    // cssFileBaseName: "<name>", // will default to "<name>" and in the end become => "<name>.svelte.css"
};

export const defaultStylesOptions = {
    autoModules: /.+\.module\..+/,
    extract: true,
    sourceMap: true,
};
