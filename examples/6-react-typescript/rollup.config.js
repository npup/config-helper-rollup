import { chr } from "../../dist/esm/index";

export default [
    chr("app", { entry: "main.tsx", minify: true, })
        .htmlTemplate()
        .styles()
        .jsx()
        .devServer({ port: 3001, })
        .ts().end(),
];
