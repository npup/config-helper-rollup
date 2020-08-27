import { chr } from "../../dist/esm/index";

export default [
    chr("app", {
        entry: "main.jsx",
        jsx: true,
        htmlTemplate: true,
        devServer: {
            port: 3001,
        },
        styles: true,
        minify: true,
    })
];
