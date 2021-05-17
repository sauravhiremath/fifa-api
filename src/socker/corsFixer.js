export const fixedOrigin = hosts => {
  const isPortPresent = /(https?:\/\/.*):(\d*)\/?(.*)/g;
  return hosts.map(host => {
    // eslint-disable-next-line no-eq-null, eqeqeq
    if (host.includes('https:') && host.match(isPortPresent) == null) {
      return [...host, ':443'];
    }

    // eslint-disable-next-line no-eq-null, eqeqeq
    if (host.includes('http:') && host.match(isPortPresent) == null) {
      return [...host, ':80'];
    }

    return host;
  });
};
