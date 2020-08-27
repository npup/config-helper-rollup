import React, { useState } from "react";
import { Foo } from "./Foo.jsx";

export const App = () => {

    const [ count, setCount ] = useState(0);

    const update = () => {
        setCount(1 + count);
    };

    return (
        <div>
            <h2>This is a React app</h2>
            <button onClick={ update }>Click me</button>
            <hr />
            <Foo count={ count } />
        </div>
    );
};
