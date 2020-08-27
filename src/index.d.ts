interface ISRConfOptions {
    src?: string;
    dist?: string;
    entry?: string;
    htmlTemplate?: boolean | any;
    svelte?: boolean | any;
    jsx?: boolean | any;
    devServer?: boolean | any;
    sourcemap?: boolean;
}
interface ISRConfDefaultOptions extends ISRConfOptions {
    src: "./src";
    dist: "./dist";
    entry: "main.js";
    htmlTemplate: false;
    svelte: false,
    jsx: false,
    devServer: false,
    sourcemap: true;
}

export declare function chr(name: string, options: ISRConfDefaultOptions): void;
