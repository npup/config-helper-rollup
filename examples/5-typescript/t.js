const x = {
    apa: "Ola",
    age: 42,
};

//const f = Object.create({ ts: Date.now(), author: "P. Envall", }, x);

const g = {
    ...x,
    __proto__: {
        _meta: "apa",
    }
}

console.log(x);
console.log(g);
console.log(g._meta);
