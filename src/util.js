export const resolvePath = path => {
    return new URL(path, import.meta.url).pathname;
};
