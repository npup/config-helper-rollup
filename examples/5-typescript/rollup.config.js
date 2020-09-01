import { chr } from "../../dist/esm/index";
const c1 =  chr("tsApp", {
    entry: "main.ts",

    ts: true,
    minify: false,
});

console.log(c1.getSettings());

export default [
    c1.get(),
];
