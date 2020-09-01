import { chr } from "../../dist/esm/index";

export default [
    chr("app")
        .svelte()
        .devServer()
        .htmlTemplate()
        .styles()
        .end(),
];
