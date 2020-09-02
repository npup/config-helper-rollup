import { chr } from "../../dist/esm/index";


export default [

    chr("app", { entry: "app1.js", })
        .styles()
        .end(),

    chr("app2", { entry: "app2.js", })
        .htmlTemplate()
        .devServer()
        .styles({ sourcemap: false, })
        .end(),

];
