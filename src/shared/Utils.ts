import { pipe } from "fp-ts/lib/function";

const parse = (val: string) => {
  try { return JSON.parse(val) }
  catch (e) { return val }
}

export const getParamsAsObject = () => {
  const params = window.location.search.substring(1).split('&');
  const paramsObject: { [key: string]: string } = {};

  return params[0] ? params.reduce((acc, param) => {
    const [key, value] = param.split('=');
    return { ...acc, [key]: pipe(value, decodeURIComponent, parse) };
  }, paramsObject) : {};
}

export const addParamsToUrl = (params: { [key: string]: string }) => {
  const url = new URL(window.location.href);
  Object.keys(params).forEach(key => url.searchParams.set(key, params[key]));
  window.history.replaceState({}, "", url.toString());
}