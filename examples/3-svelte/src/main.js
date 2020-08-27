import "./main.css";
import App from "./app/App.svelte";

const appRoot = document.querySelector(".app");
export default new App({
    target: appRoot,
});
