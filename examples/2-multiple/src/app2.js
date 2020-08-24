console.log("App 2");
import css from "./app2.module.css";

document.querySelector("h1").addEventListener("click", () => {
    console.log("module css loaded - .foo:"  + css.foo);
    const h = document.createElement("h1");
    h.classList.add(css.foo);
    h.textContent = "More content, style applied";
    document.body.appendChild(h);
});
