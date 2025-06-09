import { URL } from 'url';

export const addSubdomain = (url: string, subdomain: string) => {
  const parsed = new URL(url);
  parsed.hostname = `${subdomain}.${parsed.hostname}`;
  return parsed.toString();
};
