import { pipe } from "fp-ts/lib/function";
import { FilterElement } from '../types/form';

const parse = (val: string) => {
  try { return JSON.parse(val) }
  catch (e) { return val }
}

export const getParamsAsObject = () => {
  // const { data }: { data: FilterElement[] } = require('/data/filter.json')

  const params = window.location.search.substring(1).split('&');
  let paramsObject: { [key: string]: string | Array<string>} = {};

  if(!params[0]) return paramsObject
  params
    .map(key => key.split('='))
    .forEach(([key, value]) => {
      let _value:string | Array<string> = decodeURIComponent(value)
      
      if(['platform', 'author_platform_id', 'topics', 'persons', 'locations'].indexOf(key) > -1){
        _value = _value.split(',')
      }
      paramsObject[key] = _value
    })

  return paramsObject

}

export const addParamsToUrl = (params: { [key: string]: string }) => {
  const url = new URL(window.location.href);
  Object.keys(params).forEach(key => url.searchParams.set(key, params[key]));
  window.history.replaceState({}, "", url.toString());
}