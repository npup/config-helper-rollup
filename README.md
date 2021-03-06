# Config Helper Rollup - simple Rollup Configurations

## Description

*Config Helper Rollup* is a helper function to create configurations for the bundler [Rollup](https://rollupjs.org).
Submitting settings to this API creates readable, modifiable and working rollup configurations.

The API helps with settings for

* styles
* minification
* development server
* html template
* svelte
* jsx (in effect, React)
* TypeScript

## Contents

\-

## Installation

Install as a devDependency using npm:

    npm i config-helper-rollup -D

## Usage

In your `rollup.config.js` file, import `chr`, and export a configuration (or array of configurations):

    import { chr } from "config-helper-rollup";
    export default [
        chr("myApp").end(),
    ];

The above is calling the builder API, with all default options,
and finally invoking `end()` to produce an actual rollup configuration object.

To make the resulting configuration include settings for anything like styles, templates,
svelte, jsx or TypeScript, supply a corresponding options object - or use the chaining syntax:

    chr("myApp", {
        styles: true,
        htmlTemplate: true,
    }).end();
    
    // or
    
    chr("myApp")
        .styles()
        .htmlTemplate()
        .end();

Helpful entries in npm's package.json scripts are:

    // package.json, excerpt
    ---- >8
    "scripts": {
        "clean": "rm -rf ./dist",
        "build": "rollup -c",
        "dev": "npm run build -- -w --environment NODE_ENV:development
    }
    8< ----


### Options

The signature of `chr` is

    chr: (appName: string, options: IOptions) => IIntermediateResult;

The `appName` corresponds to a plain [Rollup](https://rollupjs.org) config's `output.name` property, and thus should be a string that is also a valid JavaScript identifier.

The options signature is

    interface IOptions {
        // Base options
        src?: string;                   // default "./src"
        dist?: string;                  // default "./dist"
        entry?: string;                 // default "main.js"
        sourcemap?: boolean;            // default: true 
        production?: boolean | string;  // default: "NODE_ENV"
        minify?: boolean;               // default: true if production mode, false otherwise (see "production" option) 
        
        // Plugin options
        styles?: boolean | IStylesOptions;              // default: false
        htmlTemplate?: boolean | IHtmlTemplateOptions;  // default: false
        devServer?: boolean | IDevServerOptions;        // default: false
        svelte?: boolean | ISvelteOptions;              // default: false
        jsx?: boolean | IJsxOptions;                    // default: false
        ts?: boolean | ITsOptions;                      // default: false
        
    }

##### Base options

| prop       | description          |
|------------|----------------------|
| src        | the source directory |
| dist       | the build directory, to which all processed files are written |
| entry      | the main entry filename (in the `src` directory) |
| production | used to determine prod/dev mode. It is either a "hard boolean", or a string indicating which `node.env` property to look at. If that property is anything but `"development"`, mode is considered to be **production**. |
| minify     | whether to minify written files. If not supplied, it will be deduced from whether mode is **production** (_true_) or not (_false_).  |


#### Plugin options

##### styles

    interface IStyleOptions {
        autoModules?: RegExp;   // default: /.+\.module\..+/
        extract?: boolean;      // default: true
        sourceMap?: boolean;    // default: true
        minify?: boolean;       // default: deduced from the Base option "minify"
    }

| prop | description |
|------|-------------|
| autoModules | Regexp to match style file names which should be treated ass css modules |
| extract | whether to extract styles to a file ow its own |
| sourceMap | whether to generate sourcemaps for styles |
| minify | whether to minify the content in bundles written |
    
Example:
    
    chr("myApp", {
        styles: {
            minify: false,
        }    
    });
    
    // or, using the chaining style API:
    chr("myApp")
        .styles({
            minify: false,
        });


##### htmlTemplate

    interface IHtmlTemplateOptions {
        template?: string;  // default: "index.html"
        page?: string;      // default: "index.html"
    }

| prop | description |
|------|-------------|
| template | template filename (in `src` directory) |
| page | output html file name (in `dist`directory) |

    

Example:

    chr("myApp", {
        htmlTemplate: {
            template: "index.v2.html",
        }
    });
    
    // or, using the chaining style API:
    chr("myApp")
        .htmlTemplate({
            template: "index.v2.html",
        });

##### devServer

    interface IDevServerOptions {
        port?: number;          // default: 3000
        livereload?: boolean;   // default: true
    }

| prop | description |
|------|-------------|
| port | port on which to start development server |
| livereload | whether to use livereload |


Example:

    chr("myApp", {
        devServer: {
            port: 8001,
        }
    });
    
    // or, using the chaining style API:
    chr("myApp")
        .devServer({
            port: 8001,
        });

##### svelte

    interface ISvelteOptions {
        cssFileBaseName?: string;   // default: deduced from the submitted base "appName" setting 
    }

| prop | description |
|------|-------------|
| cssFileBasename | base name of generated css file. Will result in `<baseName>.svelte.css` (in `dist` directory) |



Example:

    chr("myApp", {
        svelte: {
            cssFileBaseName: "styles",
        }
    });
    
    // or, using the chaining style API:
    chr("myApp")
        .svelte({
            cssFileBaseName: "styles",
        }) 

##### jsx

    interface IJsxOptions {}

| prop | description |
|------|-------------|
|      |             |

Example 

    chr("myApp", {
        jsx: true,
    });
    
    // or, using the chaining style API:
    chr("myApp")
        .jsx();

##### ts

    interface ITsOptions {}

| prop | description |
|------|-------------|
|      |             |
    
Example:

    chr("myApp", {
        ts: true,
    });
    
    // or, using the chaining style API:
    chr("myApp")
        .ts();

## License

License: Finally, include a section for the license of your project. For more information on choosing a license, check out GitHub’s licensing guide!
