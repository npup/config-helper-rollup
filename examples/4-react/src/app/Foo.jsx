import React from "react";
import css from "./foo.module.css";

export const Foo = ({ count = 0 }) => {
    return (
        <div className={ css.inner }>
            Count is: <span className={ css.count }>{ count }</span>.
        </div>
    );
};
