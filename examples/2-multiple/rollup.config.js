import { chr } from "../../dist/esm/index";

export default [
    chr("app",{
        entry: "app1.js",
        styles: true,
    }),
    chr("app2", {
        entry: "app2.js",
        htmlTemplate: true,
        devServer: true,
        styles: {
            sourceMap: false,
        },
    }),
];
