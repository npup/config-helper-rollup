import { chr } from "../../dist/esm/index";

const c1 = chr("app");
console.log("peek", c1.getSettings());
console.log(" get", c1.get());
console.log("-------------");

const c2 = chr("app");
console.log("peek", c2.getSettings());
console.log(" get", c2.get());
console.log("-------------");


export default [
    c1.get(),
    c2.get(),
];


