const test = require("tape");

const { chr } = require("../src/index");

const CWD = process.cwd();

test("basic test of existence", t => {
    t.plan(2);
    t.ok("function" == typeof chr, "is a function");
    t.equal(chr.length, 1, "there is one (1) mandatory parameter");
});


test("default conf", t => {
    const conf = chr("app").end();

    test("default conf: general shape", t => {
        t.plan(1);
        t.deepEqual(Object.keys(conf).sort(), [
            "input", "output", "plugins", "watch",
        ], "all wanted properties exist");
    });

    test("default conf: input", t => {
        t.plan(1);
        t.deepEqual(conf.input, `${ CWD }/src/main.js`);
    });

    test("default conf: output", t => {
        t.plan(1);
        t.deepEqual(conf.output, {
            name: "app",
            format: "iife",
            file: `${ CWD }/dist/app.js`,
            sourcemap: true,
            assetFileNames: "[name][extname]"
        });
    });

    test("default conf: watch", t => {
        t.plan(1);
        t.deepEqual(conf.watch, { clearScreen: false, });
    });

    test("default conf: plugins", t => {
        t.plan(1);
        const pluginNames = conf.plugins.map(({ name }) => name);
        t.deepEqual(pluginNames, [ "node-resolve", "replace", "commonjs", "terser" ]);
    });

    t.end();
});


test("custom options: input", t => {
    t.plan(1);
    const conf = chr("app", {
        src: "src2",
        entry: "special-entry.js",
    }).end();
    t.equal(conf.input, `${ CWD }/src2/special-entry.js`, "input file name should be build according to given props");
});

test("custom options: output", t => {
    t.plan(3);
    const conf = chr("app2", {
        sourcemap: false,
        dist: "dist2",
    }).end();
    t.equal(conf.output.name, "app2", "app \"name\" should match parameter name");
    t.equal(conf.output.file, `${ CWD }/dist2/app2.js`, "output filename should be built according to given props");
    t.equal(conf.output.sourcemap, false, "sourcemaps can be disabled");
});

test("custom options: force minimize ON", t => {
    t.plan(1);
    const conf = chr("app", {
        minimize: true,
    }).end();
    const pluginNames = conf.plugins.map(({ name }) => name);
    t.deepEqual(pluginNames, [ "node-resolve", "replace", "commonjs", "terser", ], "devmode should activate minification as default");
    t.end();
});

test("custom options: production forced false => minification default OFF", t => {
    t.plan(1);
    const conf = chr("app", {
        production: false,
    }).end();
    const pluginNames = conf.plugins.map(({ name }) => name);
    t.notOk(pluginNames.includes("terser"), "should turn on minification");
    t.end();
});

test("custom options: production forced false, minification true  => minification ON", t => {
    t.plan(1);
    const conf = chr("app", {
        production: false,
        minify: true,
    }).end();
    const pluginNames = conf.plugins.map(({ name }) => name);
    t.ok(pluginNames.includes("terser"), "should turn on minification");
    t.end();
});

test("custom options: with production `true` forced minification `false` => minification OFF", t => {
    t.plan(1);
    const conf = chr("app", {
        minify: false,
    }).end();
    const pluginNames = conf.plugins.map(({ name }) => name);
    t.notOk(pluginNames.includes("terser"), "should not include terser");
    t.end();
});

test("custom options: toggle plugins", t => {
    t.plan(3);
    const conf = chr("app", {
        production: false,
        styles: true,
        htmlTemplate: true,
        svelte: true,
    }).end();
    const pluginNames = conf.plugins.map(({ name }) => name);
    t.ok(pluginNames.includes("styles"), "should include \"styles\"");
    t.ok(pluginNames.includes("html-template"), "should include \"html-template\"");
    t.ok(pluginNames.includes("svelte"), "should include \"svelte\"");
    t.end();
});

