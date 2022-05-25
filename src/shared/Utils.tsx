import { addIndex, map, reduce } from "ramda";
import { useEffect, useState } from "react";
import { FilterElemPartial } from "../types/taxonomy";
import { match } from 'ts-pattern';
import { faFacebook, faTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Map } from "typescript";

export const dateFormat = "DD.MM.YYYY";

export const getParamsAsObject = () => {
  const params = window.location.search.substring(1).split('&');
  let paramsObject: { [key: string]: string | Array<string> } = {};

  if (!params[0]) return paramsObject
  params
    .map(key => key.split('='))
    .filter(([key, value]) => key !== 'access_token' && key !== 'user')
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
  reduce((acc, key: string) => acc && !obj[key], true, Object.keys(obj))

export const tagItemsToArray = (tagItems: { label: string }[]): string[] =>
  tagItems.map(({ label }) => label)

export const formatDate = (date: string) => {
  console.log(date, date.indexOf('T00:00:00.000Z') == -1, ('T00:00:00+00:00'))

  date += date.indexOf('T00:00:00.000Z') == -1 && date.indexOf('T00:00:00') == -1 ? 'T00:00:00+00:00' : ''

  return date
}

export const mapIndexed = addIndex(map);

export const formatNum = (num: number): string => {
  if (num < 10000) return num.toLocaleString()
  return Math.floor(num / 1000).toLocaleString() + 'K'
}

export const boolOperators = ['and', 'or', 'not', 'and not', 'or not'];

export const filterHasOperator = (s: string) => reduce((acc: FilterElemPartial, op: string) => {
  const str = s.toLowerCase();
  const hasOp = str.includes(op);
  return hasOp ? { hasOp, op, s } : acc;
}, { hasOp: false, s } as FilterElemPartial, boolOperators);

export const filterOperatorUpper = ({ hasOp, s, op }: FilterElemPartial): string => {
  if (!hasOp || !op) return s;
  return s.replace(op, op.toUpperCase());
}

export const getAllKeywordsWithoutOperator = (searchTerms: string[]): Array<string> =>
  [...new Set(searchTerms.flatMap((s) =>
    reduce((acc, op) => acc.toLowerCase().replaceAll(` ${op} `, ' '), s, boolOperators).split(" ")
  ))];

export const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(
    () => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay]
  );
  return debouncedValue;
}

export const platformIcon = (platform: string) =>
  match(platform)
    .with("facebook", () => <FontAwesomeIcon icon={faFacebook} />)
    .with("twitter", () => <FontAwesomeIcon icon={faTwitter} />)
    .with("youtube", () => <FontAwesomeIcon icon={faYoutube} />)
    .otherwise(() => undefined)

export const textContainsStringFromSet = (text: string, array: Array<string>) =>
  reduce<string, boolean>((acc, s) => acc || text.toLowerCase().includes(s), false, array)