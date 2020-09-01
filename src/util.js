const path = require("path");


const mergeDefaults = (options, defaults) => {
    if ("boolean" == typeof options) { options = {}; }
    const filteredOptions = Object.entries(options).reduce((acc, [ key, value ]) => {
        if (key in defaults) {
            acc[key] = value;
        }
        return acc;
    }, {});
    return { ...defaults, ...filteredOptions };
};

const resolvePath = (_path, base = "./") => {
    return path.resolve(base, _path);
};


module.exports = {
    mergeDefaults,
    resolvePath,
};
