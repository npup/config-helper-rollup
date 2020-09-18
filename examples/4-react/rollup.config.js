import { chr } from "../../dist/esm/index";


export default [
    chr("app", { entry: "main.jsx", minify: true, })
        .jsx()
        .html()
        .devServer()
        .styles()
        .end(),
];
