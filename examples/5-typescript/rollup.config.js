import { chr } from "../../dist/esm/index";

export default [
    chr("tsApp", { entry: "main.ts", minify: false, })
        .ts()
        .end(),
];
