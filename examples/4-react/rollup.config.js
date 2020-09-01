import { chr } from "../../dist/esm/index";


export default [
    chr("app", { entry: "main.jsx", minify: true, })
        .jsx()
        .htmlTemplate()
        .devServer({ port: 3001, })
        .styles()
        .end(),
];
