interface ISRConfOptions {
    name?: string;
    src?: string;
    dist?: string;
    entry?: string;
    htmlTemplate?: boolean | any;
    devServer?: boolean | any;
    sourcemap?: boolean;
}
interface ISRConfDefaultOptions extends ISRConfOptions {
    name: "app";
    src: "./src";
    dist: "./dist";
    entry: "main.js";
    htmlTemplate: false;
    devServer: false,
    sourcemap: true;
}

export declare function chr(options: ISRConfDefaultOptions): void;
