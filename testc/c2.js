import { Conf } from "./conf.js";


const c = Conf("hepp")
    .ts()
    .style({
        extract: "kanske",
        dum: true,
    })
    .svelte({
        x: false,
    });


console.log({
    peek: c.peek(),
    conf: c.get(),
});
