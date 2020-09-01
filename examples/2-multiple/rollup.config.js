import { chr } from "../../dist/esm/index";

const c1 = chr("app",{
    entry: "app1.js",
    styles: true,
});
const c2 = chr("app2", {
        entry: "app2.js",
        htmlTemplate: true,
        devServer: true,
        styles: {
            sourceMap: false,
        },
    });


console.log({
    c1: c1.peek(),
    c2: c2.peek(),
})
export default [
    c1.get(),
    c2.get(),
];
