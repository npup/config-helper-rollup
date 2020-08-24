# Rollup Helper - simple Rollup Configurations

One-stop function to create configurations for rollup - production or development builds.

Features settings for

* js
* css (including scoped css) - can use sass/less etc (if npm-installed)
* html templates
* minification and/or sourcemaps
* dev server (including hot reload)
* svelte components

## Manual basic svelte + rollup conf

To create a basic `rollup.config.js` for svelte development, something like this is typically needed:

    
    // rollup.config.js
    
    import svelte from "rollup-plugin-svelte";
    import resolve from "@rollup/plugin-node-resolve";
    import commonjs from "@rollup/plugin-commonjs";

    export default [ // array of 1 or more configurations
        {
            input: "./src/main.js",
            output: {
                name: "app",
                format: "iife",
                file: "./dist",
            },
            plugins: [
                svelte({
                    dev: "production" != process.env.NODE_ENV,
                    css(styles) {
                        styles.write("./dist/bundle.css);
                    }
                }),
                resolve({
                    browser: true,
                    dedupe: [ "svelte" ],
                }),
                commonjs(),
            ]
        }
    ]; 

And some more, of course if one wants a dev server and some hot reloading etc.

## Rollup Helper helps

`rh` is a function than builds a configuration object for you. It can help you with all the things in the manual configuration above, and some more. Here is the menu:

* selecting input files and names of output files
* source maps
* minification
* development server with options like
    * port
    * optional livereload

## Example

Config

    // rollup.config.js    
    import { rch } from "rollup-config-helper";
    
    export default [ // array of 1 or more configurations
        rch({ name: "app" }) // voilà!
    ];

Npm scripts

    // package.json, excerpt
    
    ---- >8
    "scripts": {
        "clean": "rm -rf ./dist",
        "build": "rollup -c",
        "dev": "npm run build -- -w --environment NODE_ENV:development
    }
    8< ----


This uses the defaults, which creates a configuration that handles

* using a html template file `./src/index.html`.
* using an entry file `./src/main.js`.
* building to
    * `./dist/index.html`
    * `./dist/app.js`
    * `./dist/app.css`
* (plus sourcemaps)
* serving the dist folder on port `3000`
* rebuilding on changes
* using hot reload

Those things can all be changed. Here are all available options, and any defaults:

    {
        name:       -no default-    // the rollup bundle output name property
        
        src:        "./src",        // src directory
        dist:       "./dist",       // dist directory
        entry:      "main.js",      // main entry js file
        sourcemap:  true,           // yes, please
        
        htmlTemplate: false,        // use an html file template?
        devServer:  false,          // if a development server should be started for this build
        svelte: false,              // process svelte files
        styles: false,              // extract referenced styles and inject <link> elements in html template

        production: "NODE_ENV",     // a hard boolean flag - OR a string that says which node.env property to look at (if that property is not exactly equal to "development", mode is considered to be "production")
        
        minimize:   null,           // if not an explicit boolean, it will be the same as the "is production" flag (see options#production)
    }


Call it multiple times if you want, of course:


    // rollup.config.js
    
    import { rch } from "rollup-config-helper";
    
    export default = [
        rch(),
        rch({
            name: "app2",
            htmlTemplate: true,
            entry: "second.js",
        }),
    ];


.. where the second configuration

1) points conf to a secondary set of files and outputs 
2) avoids starting a second server

The result is two single page apps, served by the same dev server (hot reloading etc. still).

