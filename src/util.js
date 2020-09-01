
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


module.exports = {
    mergeDefaults,
};
