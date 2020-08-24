import { chr } from "../../src/index";


export default [
    chr({
        name: "app",
        entry: "app1.js",
        styles: true,
    }),
    chr({
        name: "app2",
        entry: "app2.js",
        htmlTemplate: true,
        devServer: true,
        styles: {
            sourceMap: false,
        },
    }),
];
