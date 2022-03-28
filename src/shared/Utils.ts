import { reduce } from "fp-ts/lib/Array";

const parse = (val: string) => {
  try { return JSON.parse(val) }
  catch (e) { return val }
}

export const getParamsAsObject = () => {
  // const { data }: { data: FilterElement[] } = require('/data/filter.json')

  const params = window.location.search.substring(1).split('&');
  let paramsObject: { [key: string]: string | Array<string> } = {};

  if (!params[0]) return paramsObject
  params
    .map(key => key.split('='))
    .forEach(([key, value]) => {
      let _value: string | Array<string> = decodeURIComponent(value)

      if (['platform', 'author_platform_id', 'topics', 'persons', 'locations'].indexOf(key) > -1) {
        _value = _value.split(',')
      }
      paramsObject[key] = _value
    })

  return paramsObject

}

export const addParamsToUrl = (params: { [key: string]: string }) => {
  const url = new URL(window.location.href);
  Object.keys(params).forEach(key =>
    (Array.isArray(params[key]) ? params[key].length : params[key])
      ? url.searchParams.set(key, params[key])
      : url.searchParams.delete(key)
  );

  window.history.replaceState({}, "", url.toString());
}

export const isObjectEmpty = (obj: { [key: string]: any }) =>
  reduce(true, (acc, key: string) => acc && !obj[key])(Object.keys(obj))

export const tagItemsToArray = (tagItems: { label: string }[]): string[] =>
  tagItems.map(({ label }) => label)