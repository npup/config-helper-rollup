import { chr } from "../../dist/esm/index";

const c1 =  chr("app", {
    entry: "main.jsx",
    jsx: true,
    htmlTemplate: true,
    devServer: {
        port: 3001,
    },
    styles: true,
    minify: true,
});

console.log(c1.peek());

export default [
   c1.get(),
];
