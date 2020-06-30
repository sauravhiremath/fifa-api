export const fixedOrigin = hosts => {
    const isPortPresent = /(https?:\/\/.*):(\d*)\/?(.*)/g;
    return hosts.map(host => {
        // eslint-disable-next-line no-eq-null, eqeqeq
        if (host.indexOf('https:') !== -1 && host.match(isPortPresent) == null) {
            return host.concat(':443');
        }

        // eslint-disable-next-line no-eq-null, eqeqeq
        if (host.indexOf('http:') !== -1 && host.match(isPortPresent) == null) {
            return host.concat(':80');
        }

        return host;
    });
};
