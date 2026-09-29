export function withBase(path = '/') {
  const base = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL.slice(0, -1)
    : import.meta.env.BASE_URL;
  const clean = path.startsWith('/') ? path : `/${path}`;
  return clean === '/' ? `${base}/` : `${base}${clean}`;
}
