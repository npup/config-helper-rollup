const add: (a: number, b: number) => string = (a, b) => {
    return `${ a } + ${ b } = ${  a + b }`;
};


console.log("Adding 2 and 7 becomes", add(2, 7));
