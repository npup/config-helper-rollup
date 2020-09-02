# Rollup Helper - simple Rollup Configurations

One-stop function to create configurations for rollup - production or development builds.

Features settings for

* js
* css (including scoped css) - can use sass/less etc (if npm-installed)
* html templates
* minification and/or sourcemaps
* dev server (including hot reload)
* svelte components
* react

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

`chr` is a function than builds a configuration object for you. Its options can help you with all the things in the manual configuration above, and some more. Here is the menu:

* selecting input files and names of output files
* source maps
* minification
* development server with options like
    * port
    * optional livereload

## Example

Give the `name` property of a normal rollup config options object, possibly submit any extra options if wanted, and finish the configuration build.

Basic config

    // rollup.config.js    
    import { chr } from "config-helper-rollup";
    
    export default [ // array of 1 or more configurations
        chr("app").end() // voilà!
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

## Base options

* src - default value: `"./src"` 
    * src directory
* dist - default value: `"./dist"`
    * dist (build) directory
* entry - default value: `"main.js"`
    * entry source file name
* sourcemap - default value: `true`
    * whether to generate source maps for (relevant) processed files
* minify - default value: `null`
    * whether to generated files should be minified. A non-boolean value means that the calculated `production` mode decide (see option "production"). 
* production - default value: `NODE_ENV`
    * a hard boolean flag - **or** a string that says which `node.env` property to look at (if that property is not exactly equal to `"development"`, mode is considered to be *production*)


## Additional options


### htmlTemplate

to activate settings for using an HTML template, invoke `htmlTemplate`:

    const conf = chr("app")
        .htmlTemplate(options: IHTMLTemplateOptions)
        .end();

##### IHTMLTemplateOptions
false,        // use an html file template?

                                              
### devServer

false,          // if a development server should be started for this build                

###svelte

false,              // process svelte files

                                                    
### jsx

false,                 // process jsx files (presumably React)                                    

### styles
false,              // extract referenced styles and inject <link> elements in html template   


Those things can all be changed. Here are all available options, and any defaults:

    {
        
        src:        "./src",        // src directory
        dist:       "./dist",       // dist directory
        entry:      "main.js",      // main entry js file
        sourcemap:  true,           // yes, please
        minify:   null,           // if not an explicit boolean, it will be the same as the "is production" flag (see options#production)
        production: "NODE_ENV",     // a hard boolean flag - OR a string that says which node.env property to look at (if that property is not exactly equal to "development", mode is considered to be "production")
        
        htmlTemplate: false,        // use an html file template?
        devServer:  false,          // if a development server should be started for this build
        svelte: false,              // process svelte files
        jsx: false,                 // process jsx files (presumably React)
        styles: false,              // extract referenced styles and inject <link> elements in html template

        
        
        
    }
    
    
## Options

### src
The src directory. Defaults to `./src`.

### dist  
The output directory. Defaults to `./dist`. 

### entry
The main entry js file. Defaults to `main.js`.

### sourcemap
If sourcemaps should be generated (js, css). Defauls to `true`.

### htmlTemplate
If an html template should be processed. Defaults to `false`.

Possible values: `true`, `false`, `<HtmlTemplateOptions>`.

##### HtmlTemplateOptions:
   
`template` - src template. Defaults to `index.html`.  
`page` - output file name (in output directory). Defaults to `index.html`.
    

 



Call it multiple times if you want, of course:


    // rollup.config.js
    
    import { chr } from "config-helper-rollup";
    
    export default = [
        chr("app"),
        chr("app2", {
            htmlTemplate: true,
            entry: "second.js",
        }),
    ];


.. where the second configuration

1) points conf to a secondary set of files and outputs 
2) avoids starting a second server

The result is two single page apps, served by the same dev server (hot reloading etc. still).

