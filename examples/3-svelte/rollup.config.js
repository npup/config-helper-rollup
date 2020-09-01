import { chr } from "../../dist/esm/index";

const c1 = chr("app", {
    svelte: true,
    devServer: true,
    htmlTemplate: true,
    styles: true,
});
console.log(c1.peek());

export default [
    c1.get()
];
