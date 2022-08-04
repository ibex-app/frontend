import { addIndex, curry, map, pipe, reduce, split } from "ramda";
import { useEffect, useState } from "react";
import { FilterElemPartial } from "../types/taxonomy";
import { match } from 'ts-pattern';
import { faFacebook, faTwitter, faYoutube, faTelegram } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation, useNavigate } from "react-router-dom";

export const dateFormat = "DD.MM.YYYY";

export const then = curry((f, p) => p.then(f));

export const ofPromise = (item: any) => new Promise<any>((res) => res(item));

export const useNavWithQuery = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  return (path: string) => navigate(`${path}${search}`);
}

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
  // console.log(date, date.indexOf('T00:00:00.000Z') == -1, ('T00:00:00+00:00'))

  // date += date.indexOf('T00:00:00.000Z') == -1 && date.indexOf('T00:00:00') == -1 ? 'T00:00:00+00:00' : ''

  return date
}

export const mapIndexed = addIndex(map);

export const formatNum = (num: number): string => {
  if (num < 10000) return num.toLocaleString()
  return Math.floor(num / 1000).toLocaleString() + 'K'
}

export const boolOperators = ['and', 'or', 'not']; // 'and not', 'or not'

export type WordList = {
  type: string;
  keyword: string;
}[];

export const getWordList = pipe<string[], string[], WordList>(
  split(' '),
  map((word) => {
    const isOp = boolOperators.includes(word.toLowerCase());

    return {
      type: isOp ? 'op' : 'keyword',
      keyword: isOp ? word.toUpperCase() : word
    }
  })
)

export const filterHasOperator = (s: string) => reduce((acc: FilterElemPartial, op: string) => {
  const str = s.toLowerCase();
  const hasOp = str.includes(` ${op} `) || str.endsWith(` ${op}`);
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
    .with("telegram", () => <FontAwesomeIcon icon={faTelegram} />)
    .with("vkontakte", () => <img className='vk-logo' src='https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/VK.com-logo.svg/192px-VK.com-logo.svg.png' />)
    .otherwise(() => undefined)

export const textContainsStringFromSet = (text: string, array: Array<string>) =>
  reduce<string, boolean>((acc, s) => acc || text.toLowerCase().includes(s), false, array);

export const stopWords = [
  "i",
  "me",
  "my",
  "myself",
  "we",
  "our",
  "ours",
  "ourselves",
  "you",
  "your",
  "yours",
  "yourself",
  "yourselves",
  "he",
  "him",
  "his",
  "himself",
  "she",
  "her",
  "hers",
  "herself",
  "it",
  "its",
  "itself",
  "they",
  "them",
  "their",
  "theirs",
  "themselves",
  "what",
  "which",
  "who",
  "whom",
  "this",
  "that",
  "these",
  "those",
  "am",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "have",
  "has",
  "had",
  "having",
  "do",
  "does",
  "did",
  "doing",
  "a",
  "an",
  "the",
  "and",
  "but",
  "if",
  "or",
  "because",
  "as",
  "until",
  "while",
  "of",
  "at",
  "by",
  "for",
  "with",
  "about",
  "against",
  "between",
  "into",
  "through",
  "during",
  "before",
  "after",
  "above",
  "below",
  "to",
  "from",
  "up",
  "down",
  "in",
  "out",
  "on",
  "off",
  "over",
  "under",
  "again",
  "further",
  "then",
  "once",
  "here",
  "there",
  "when",
  "where",
  "why",
  "how",
  "all",
  "any",
  "both",
  "each",
  "few",
  "more",
  "most",
  "other",
  "some",
  "such",
  "no",
  "nor",
  "not",
  "only",
  "own",
  "same",
  "so",
  "than",
  "too",
  "very",
  "s",
  "t",
  "can",
  "will",
  "just",
  "don",
  "should",
  "now"
]