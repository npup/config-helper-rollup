const { chr } = require("./src/index2");


const c = chr("hepp")
    .htmlTemplate()
    .styles()
    .ts({
        foo: 42,
    });

console.log(c.get());


console.log("------");


const d = chr("apa", {
    htmlTemplate: true,
    styles: true,
});
console.log(d.get());
console.log(JSON.stringify(d.get().rollupConf.plugins));

