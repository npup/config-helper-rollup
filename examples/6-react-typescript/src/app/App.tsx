import * as React from "react";
const { useState } = React;

interface IAppProps {
    name?: string;
}

const defaultProps: Partial<IAppProps> = {
    name: "John Doe",
}
export const App: React.FC<IAppProps> = (props) => {
    props = { ...defaultProps, ...props };
    const [ count, setCount ] = useState<number>(0);
    const inc = () => setCount(count + 1);

    return (
        <div>
            App (tsx) says HELLO to { props.name }

            <div>
                Count is: { count }. <button onClick={ inc }>Increase</button>
            </div>
        </div>
    );
};
