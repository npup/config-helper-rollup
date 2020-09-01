
const defaultSvelteOptions = {
    x: true,
};
const defaultStyleOptions = {
    extract: true,
};
const defaultTsOptions = {
    foo: false,
};

const mergeDefaults = (options, defaults) => {
    if ("boolean" == typeof options) { options = {}; }
    return { ...defaults, ...options  };
};


class Meta {
    constructor() {
        this.data = {};
    }

    set(key, value) {
        this.data[key] = value;
    }

}

export function Conf (name, options = {}) {
    if (!(this instanceof Conf)) {
        return new Conf(name, options);
    }
    if ("string" != typeof name && name) {
        throw Error("name is mandatory");
    }
    let { svelte, style, ts } = options;

    const result = {};
    result.__proto__.meta = new Meta();

    const handleSvelte = this.svelte = (options, defaults = defaultSvelteOptions) => {
        result.svelte = mergeDefaults(options, defaults);
        return this;
    };
    const handleStyle = this.style = (options, defaults = defaultStyleOptions) => {
        result.style = mergeDefaults(options, defaults);
        return this;
    };
    const handleTs = this.ts = (options, defaults = defaultTsOptions) => {
        result.ts = mergeDefaults(options, defaults);
        return this;
    };

    if (svelte) {
        handleSvelte(svelte, defaultSvelteOptions);
    }
    if (style) {
        handleStyle(style, defaultStyleOptions);
    }
    if (ts) {
        handleTs(ts, defaultTsOptions);
    }

    this.result = result;
    this.get = () => {
        return this.result;
    };

    this.valueOf = () => this.result;


    return this;
}



