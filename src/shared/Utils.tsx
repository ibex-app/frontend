import { addIndex, curry, map, pipe, reduce, split, replace, toUpper } from "ramda";
import { useEffect, useState } from "react";
import { FilterElemPartial } from "../types/taxonomy";
import { match } from 'ts-pattern';
import { faFacebook, faTwitter, faYoutube, faTelegram } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation, useNavigate } from "react-router-dom";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

export const dateFormat = "DD.MM.YYYY";

export const then = curry((f, p) => p.then(f));

export const ofPromise = (item: any) => new Promise<any>((res) => res(item));

export const capitalize = replace(/^./, toUpper);

export const useNavWithQuery = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  return (path: string) => navigate(`${path}${search}`);
}

export const useOnScreen = (ref: React.MutableRefObject<any>) => {
  const [isIntersecting, setIntersecting] = useState(false)

  const observer = new IntersectionObserver(
    ([entry]) => setIntersecting(entry.isIntersecting)
  )

  useEffect(() => {
    if (ref.current) observer.observe(ref.current)
    return () => { observer.disconnect() }
  }, [])

  return isIntersecting
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
  if (num == -1) return 'N/A'
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

const openInNewTab = (url: any) => {
  window.open(url, '_blank');
}

export const blankLink = (option: any) => {
  return <a className="blank-icon" onClick={e => { e.stopPropagation(); e.preventDefault(); openInNewTab(option.url); }} target='_blank' href={option.url}><FontAwesomeIcon icon={faArrowUpRightFromSquare} /></a>
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
  "now",
  'ა.შ.', 'აგერ', 'აგრეთვე', 'ალბათ', 'ამაზე', 'ამას', 'ამასთან', 'ამასთანავე', 'ამგვარად', 'ამდენად', 'ამით', 'ამის', 'ამისთვის', 'ამიტომ', 'ამიტომაც', 'ამჟამად', 'ამჯერად', 'ან', 'ანუ', 'არ', 'არა', 'არადა', 'არათუ', 'არამარტო', 'არამედ', 'არამხოლოდ', 'არანაკლებ', 'არასოდეს', 'არაუადრეს', 'არაუგვიანეს', 'არაუმეტეს', 'არსად', 'არსაიდან', 'არც', 'არცერთ', 'ასევე', 'ასეც', 'აქამდე', 'აღარ', 'აღარც', 'ბოლოს', 'ბოლოსკენ', 'გამო', 'გამუდმებით', 'განსაკუთრებით', 'გარდა', 'გარეშე', 'და', 'დასასრულს', 'დასაწყისში', 'დროულად', 'ე.ი.', 'ე.წ.', 'ეგებ', 'ერთადერთი', 'ერთადერთმა', 'ერთ-ერთი', 'ერთხელ', 'ესოდე', 'ვერ', 'ვითომ', 'ვინაიდან', 'ვინძლო', 'ვისაც', 'ზემოაღნიშნულმა', 'ზოგჯერ', 'თავად', 'თავადაც', 'თავადვე', 'თავდაპირველად', 'თავიდანვე', 'თავის მხრივ', 'თან', 'თანაც', 'თანახმადაც', 'თანდათან', 'თვით', 'თვითონ', 'თვითონაც', 'თვითონვე', 'თითოეულმა', 'თითქოს', 'თუ', 'თუკი', 'თუმცა', 'თუმცაღა', 'თუნდაც', 'იმავდროულად', 'იმავე', 'იმან', 'იმას', 'იმდენად', 'იმთავითვე', 'იმით', 'იმის', 'იმისთვის', 'იმიტომ', 'ისევე', 'ისეთი', 'ისეც', 'იშვიათად', 'კერძოდ', 'კვლავ', 'კი', 'კიდევ', 'მაგალითად', 'მაგან', 'მაგას', 'მაგით', 'მაგის', 'მაგრამ', 'მათი', 'მაინც', 'მანამ', 'მანამდე', 'მართალია', 'მარტო', 'მაშასადამე', 'მაშინ', 'მაშინვე', 'მერე', 'მეტად', 'მთელი', 'მიერ', 'მით', 'მიმართ', 'მისივე', 'მსგავსი', 'მხოლოდ', 'ნაწილობრივ', 'ნეტავ', 'ნეტავი', 'ნუ', 'ნურასოდეს', 'ნურც', 'ნუღარ', 'ნუღარც', 'ოდენ', 'ოდესღაც', 'ოღონდ', 'პირველი', 'პირიქით', 'პრინციპში', 'რადგან', 'რადგანაც', 'რათა', 'რაკი', 'რამდენად', 'რამდენადაც', 'რამეთუ', 'რამენაირად', 'რამეფრად', 'რანაირადაც', 'რასაკვირველია', 'რასაც', 'რაღაც', 'რაც', 'რითაც', 'რისთვისაც', 'როგორადაც', 'როგორიც', 'როგორიცაა', 'როგორღაც', 'როგორც', 'როდესაც', 'როდესღაც', 'რომ', 'რომელიმე', 'რომელიც', 'რომელსაც', 'რომლებიც', 'რომლითაც', 'რომლის', 'როცა', 'საბოლოოდ', 'სადაც', 'სადღაც', 'საერთოდ', 'სათანადოდ', 'საიდანაც', 'სამომავლოდ', 'სანამ', 'სანამდე', 'სრულად', 'სულ', 'სწორედ', 'სხვადასხვა', 'სხვები', 'უკვე', 'უნდა', 'უსათუოდ', 'უფრო', 'უცებ', 'უცნაურად', 'ფაქტობრივად', 'ყველა', 'ყოველგვარი', 'ყოველთვის', 'ყოველი', 'ყოველივე', 'შედარებით', 'შედეგად', 'შემდგომ', 'შემდგომში', 'შემდეგ', 'შესახებ', 'შორის', 'ჩვეულებრივ', 'წინააღმდეგ', 'წინაშე', 'ხან', 'ხოლმე', 'ხოლო', 'ხშირად', 'ჯერაც', 'ჯერჯერობით', 'ამის გარდა', 'ამის გარეშე', 'ამის მიუხედავად', 'ამასთან ერთად', 'ამის მიხედვით', 'ამის ნაცვლად', 'ამის პასუხად', 'ამასთან შედარებით', 'ამბობს, რომ', 'ამ დროს', 'ამ თემაზე', 'ამ მიზნით', 'ამის საპირისპიროდ', 'ამის გამო', 'ამ მხრივ', 'ამის უარსაყოფად', 'ამის შედეგად', 'ამ შემთხვევაში', 'ამავე დროს', 'ამას გარდა', 'ამასთან დაკავშირებით', 'ამის შემდეგ', 'ამის შესაბამისად', 'ამის შესახებ', 'ამისგან განსხვავებით', 'არა მარტო', 'არა მხოლოდ', 'არა უადრეს', 'არა უგვიანეს', 'არც ერთი', 'არც კი', 'არც მეორე', 'ასე ვთქვათ', 'ასე მაგალითად', 'ასე რომ', 'ასე შემდეგ', 'ასევე განიხილავს', 'აქედან გამომდინარე', 'აქედან დასკვნა', 'აღნიშნა რომ', 'აღნიშნულთან დაკავშირებით', 'აცხადებს რომ', 'ბოლო ერთი', 'ბოლო პერიოდში', 'ბოლო წლებში', 'გამოთქვა იმედი', 'განაცხადა, რომ', 'განმარტა, რომ', 'გარდა ამისა', 'გარშემო არსებული', 'და სხვ.', 'და სხვა', 'დაადასტურა, რომ', 'ეგრეთ წოდებული', 'ეგრეთ წოდებულმა', 'ერთი თვალსაზრისით', 'ერთი მხრივ', 'ერთის მხრივ', 'ეს კი', 'ესე იგი', 'ვიდრე არ', 'თავიდან ბოლომდე', 'თუ რამდენად', 'თუ როგორ', 'იგივეა რაც', 'იმ შემთხვევაში', 'იმაზე მეტი', 'იმაზე, რომ', 'იმას, რომ', 'იმასთან დაკავშირებით', 'იმდენად რამდენადაც', 'იმედი გამოთქვა', 'იმის გამო', 'იმის თაობაზე', 'იმის საწინააღმდეგოდ', 'იმისათვის, რომ', 'იმისთვის, რათა', 'იმისთვის, რომ', 'იმიტომ, რომ', 'ის, რომელიც', 'ისე როგორც', 'ისე, რომ', 'ისევე როგორც', 'ისეთი როგორიც', 'იქიდან გამომდინარე', 'კიდევ ერთხელ', 'მაგრამ თუ', 'მათ შორის', 'მათი ვარაუდით', 'მანამ, სანამ', 'მას შემდეგ', 'მაშინ, როცა', 'მაშინაც კი', 'მეორე მხრივ', 'მეორეც ერთი', 'მერე მეორე', 'მით უფრო', 'მიიჩნევს, რომ', 'მისი განმარტებით', 'მისი თქმით', 'მისივე თქმით', 'მიუხედავად ამისა', 'ნურც კი', 'პირველ რიგში', 'რა დროსაც', 'რა მიზეზითაც', 'რაც შეეხება', 'რაც შეიძლება', 'რის გამოც', 'რის საფუძველზედაც', 'რის საფუძველზეც', 'რის შედეგადაც', 'რის შემდეგაც', 'როგორც კი', 'რომ არა', 'რომ თუ', 'რომელთა გამოც', 'რომლის თანახმად', 'რომლის თანახმადაც', 'რომლის მიხედვითაც', 'რომლის შესახებ', 'საკითხთან დაკავშირებით', 'სულ მცირე', 'სულ ცოტა', 'სხვა კუთხით', 'სხვა მხრივ', 'სხვა რამ', 'სხვათა შორის', 'უფრო მეტიც', 'ყოველივე ეს', 'შემდეგ უკვე', 'ჩვენი განცხადებით', 'ჯერ ერთი', 'ჯერ კიდევ', 'ამ ბოლო დროს', 'ამა თუ იმ', 'ასე თუ ისე', 'აქედან ჩანს, რომ', 'ბოლოს და ბოლოს', 'გამომდინარე იქიდან, რომ', 'და ასე შემდეგ', 'ვინაიდან და რადგანაც', 'თუ რის საფუძველზე', 'იმის გათვალისწინებით, რომ', 'იმის გამო, რომ', 'იმის ნაცვლად, რომ', 'ისევ და ისევ', 'იქვე აღნიშნა, რომ', 'იქიდან გამომდინარე, რომ', 'კიდევ და კიდევ', 'მაინც და მაინც', 'მას შემდეგ, რაც', 'მიუხედავად იმისა, თუ', 'მიუხედავად იმისა, რომ', 'როგორც უკვე ითქვა', 'როდის და რატომ', 'უფრო და უფრ' ,
  "!","\"","$","%","&","'","(",")","*","+",",","-",".","...","0","1","2","3","4","5","6","7","8","9",";","<","=",">","?","@","\\","^","_","`","|","~","·","—","——","‘","’","“","”","…","、","。","〈","〉","《","》","가","가까스로","가령","각","각각","각자","각종","갖고말하자면","같다","같이","개의치않고","거니와","거바","거의","것","것과 같이","것들","게다가","게우다","겨우","견지에서","결과에 이르다","결국","결론을 낼 수 있다","겸사겸사","고려하면","고로","곧","공동으로","과","과연","관계가 있다","관계없이","관련이 있다","관하여","관한","관해서는","구","구체적으로","구토하다","그","그들","그때","그래","그래도","그래서","그러나","그러니","그러니까","그러면","그러므로","그러한즉","그런 까닭에","그런데","그런즉","그럼","그럼에도 불구하고","그렇게 함으로써","그렇지","그렇지 않다면","그렇지 않으면","그렇지만","그렇지않으면","그리고","그리하여","그만이다","그에 따르는","그위에","그저","그중에서","그치지 않다","근거로","근거하여","기대여","기점으로","기준으로","기타","까닭으로","까악","까지","까지 미치다","까지도","꽈당","끙끙","끼익","나","나머지는","남들","남짓","너","너희","너희들","네","넷","년","논하지 않다","놀라다","누가 알겠는가","누구","다른","다른 방면으로","다만","다섯","다소","다수","다시 말하자면","다시말하면","다음","다음에","다음으로","단지","답다","당신","당장","대로 하다","대하면","대하여","대해 말하자면","대해서","댕그","더구나","더군다나","더라도","더불어","더욱더","더욱이는","도달하다","도착하다","동시에","동안","된바에야","된이상","두번째로","둘","둥둥","뒤따라","뒤이어","든간에","들","등","등등","딩동","따라","따라서","따위","따지지 않다","딱","때","때가 되어","때문에","또","또한","뚝뚝","라 해도","령","로","로 인하여","로부터","로써","륙","를","마음대로","마저","마저도","마치","막론하고","만 못하다","만약","만약에","만은 아니다","만이 아니다","만일","만큼","말하자면","말할것도 없고","매","매번","메쓰겁다","몇","모","모두","무렵","무릎쓰고","무슨","무엇","무엇때문에","물론","및","바꾸어말하면","바꾸어말하자면","바꾸어서 말하면","바꾸어서 한다면","바꿔 말하면","바로","바와같이","밖에 안된다","반대로","반대로 말하자면","반드시","버금","보는데서","보다더","보드득","본대로","봐","봐라","부류의 사람들","부터","불구하고","불문하고","붕붕","비걱거리다","비교적","비길수 없다","비로소","비록","비슷하다","비추어 보아","비하면","뿐만 아니라","뿐만아니라","뿐이다","삐걱","삐걱거리다","사","삼","상대적으로 말하자면","생각한대로","설령","설마","설사","셋","소생","소인","솨","쉿","습니까","습니다","시각","시간","시작하여","시초에","시키다","실로","심지어","아","아니","아니나다를가","아니라면","아니면","아니었다면","아래윗","아무거나","아무도","아야","아울러","아이","아이고","아이구","아이야","아이쿠","아하","아홉","안 그러면","않기 위하여","않기 위해서","알 수 있다","알았어","앗","앞에서","앞의것","야","약간","양자","어","어기여차","어느","어느 년도","어느것","어느곳","어느때","어느쪽","어느해","어디","어때","어떠한","어떤","어떤것","어떤것들","어떻게","어떻해","어이","어째서","어쨋든","어쩔수 없다","어찌","어찌됏든","어찌됏어","어찌하든지","어찌하여","언제","언젠가","얼마","얼마 안 되는 것","얼마간","얼마나","얼마든지","얼마만큼","얼마큼","엉엉","에","에 가서","에 달려 있다","에 대해","에 있다","에 한하다","에게","에서","여","여기","여덟","여러분","여보시오","여부","여섯","여전히","여차","연관되다","연이서","영","영차","옆사람","예","예를 들면","예를 들자면","예컨대","예하면","오","오로지","오르다","오자마자","오직","오호","오히려","와","와 같은 사람들","와르르","와아","왜","왜냐하면","외에도","요만큼","요만한 것","요만한걸","요컨대","우르르","우리","우리들","우선","우에 종합한것과같이","운운","월","위에서 서술한바와같이","위하여","위해서","윙윙","육","으로","으로 인하여","으로서","으로써","을","응","응당","의","의거하여","의지하여","의해","의해되다","의해서","이","이 되다","이 때문에","이 밖에","이 외에","이 정도의","이것","이곳","이때","이라면","이래","이러이러하다","이러한","이런","이럴정도로","이렇게 많은 것","이렇게되면","이렇게말하자면","이렇구나","이로 인하여","이르기까지","이리하여","이만큼","이번","이봐","이상","이어서","이었다","이와 같다","이와 같은","이와 반대로","이와같다면","이외에도","이용하여","이유만으로","이젠","이지만","이쪽","이천구","이천육","이천칠","이천팔","인 듯하다","인젠","일","일것이다","일곱","일단","일때","일반적으로","일지라도","임에 틀림없다","입각하여","입장에서","잇따라","있다","자","자기","자기집","자마자","자신","잠깐","잠시","저","저것","저것만큼","저기","저쪽","저희","전부","전자","전후","점에서 보아","정도에 이르다","제","제각기","제외하고","조금","조차","조차도","졸졸","좀","좋아","좍좍","주룩주룩","주저하지 않고","줄은 몰랏다","줄은모른다","중에서","중의하나","즈음하여","즉","즉시","지든지","지만","지말고","진짜로","쪽으로","차라리","참","참나","첫번째로","쳇","총적으로","총적으로 말하면","총적으로 보면","칠","콸콸","쾅쾅","쿵","타다","타인","탕탕","토하다","통하여","툭","퉤","틈타","팍","팔","퍽","펄렁","하","하게될것이다","하게하다","하겠는가","하고 있다","하고있었다","하곤하였다","하구나","하기 때문에","하기 위하여","하기는한데","하기만 하면","하기보다는","하기에","하나","하느니","하는 김에","하는 편이 낫다","하는것도","하는것만 못하다","하는것이 낫다","하는바","하더라도","하도다","하도록시키다","하도록하다","하든지","하려고하다","하마터면","하면 할수록","하면된다","하면서","하물며","하여금","하여야","하자마자","하지 않는다면","하지 않도록","하지마","하지마라","하지만","하하","한 까닭에","한 이유는","한 후","한다면","한다면 몰라도","한데","한마디","한적이있다","한켠으로는","한항목","할 따름이다","할 생각이다","할 줄 안다","할 지경이다","할 힘이 있다","할때","할만하다","할망정","할뿐","할수있다","할수있어","할줄알다","할지라도","할지언정","함께","해도된다","해도좋다","해봐요","해서는 안된다","해야한다","해요","했어요","향하다","향하여","향해서","허","허걱","허허","헉","헉헉","헐떡헐떡","형식으로 쓰여","혹시","혹은","혼자","훨씬","휘익","휴","흐흐","흥","힘입어","︿","！","＃","＄","％","＆","（","）","＊","＋","，","０","１","２","３","４","５","６","７","８","９","：","；","＜","＞","？","＠","［","］","｛","｜","｝","～","￥",
  "а","алло","без","белый","близко","более","больше","большой","будем","будет","будете","будешь","будто","буду","будут","будь","бы","бывает","бывь","был","была","были","было","быть","в","важная","важное","важные","важный","вам","вами","вас","ваш","ваша","ваше","ваши","вверх","вдали","вдруг","ведь","везде","вернуться","весь","вечер","взгляд","взять","вид","видеть","вместе","вниз","внизу","во","вода","война","вокруг","вон","вообще","вопрос","восемнадцатый","восемнадцать","восемь","восьмой","вот","впрочем","времени","время","все","всегда","всего","всем","всеми","всему","всех","всею","всю","всюду","вся","всё","второй","вы","выйти","г","где","главный","глаз","говорил","говорит","говорить","год","года","году","голова","голос","город","да","давать","давно","даже","далекий","далеко","дальше","даром","дать","два","двадцатый","двадцать","две","двенадцатый","двенадцать","дверь","двух","девятнадцатый","девятнадцать","девятый","девять","действительно","дел","делать","дело","день","деньги","десятый","десять","для","до","довольно","долго","должно","должный","дом","дорога","друг","другая","другие","других","друго","другое","другой","думать","душа","е","его","ее","ей","ему","если","есть","еще","ещё","ею","её","ж","ждать","же","жена","женщина","жизнь","жить","за","занят","занята","занято","заняты","затем","зато","зачем","здесь","земля","знать","значит","значить","и","идти","из","или","им","именно","иметь","ими","имя","иногда","их","к","каждая","каждое","каждые","каждый","кажется","казаться","как","какая","какой","кем","книга","когда","кого","ком","комната","кому","конец","конечно","которая","которого","которой","которые","который","которых","кроме","кругом","кто","куда","лежать","лет","ли","лицо","лишь","лучше","любить","люди","м","маленький","мало","мать","машина","между","меля","менее","меньше","меня","место","миллионов","мимо","минута","мир","мира","мне","много","многочисленная","многочисленное","многочисленные","многочисленный","мной","мною","мог","могут","мож","может","можно","можхо","мои","мой","мор","москва","мочь","моя","моё","мы","на","наверху","над","надо","назад","наиболее","найти","наконец","нам","нами","народ","нас","начала","начать","наш","наша","наше","наши","не","него","недавно","недалеко","нее","ней","некоторый","нельзя","нем","немного","нему","непрерывно","нередко","несколько","нет","нею","неё","ни","нибудь","ниже","низко","никакой","никогда","никто","никуда","ними","них","ничего","ничто","но","новый","нога","ночь","ну","нужно","нужный","нх","о","об","оба","обычно","один","одиннадцатый","одиннадцать","однажды","однако","одного","одной","оказаться","окно","около","он","она","они","оно","опять","особенно","остаться","от","ответить","отец","отовсюду","отсюда","очень","первый","перед","писать","плечо","по","под","подумать","пожалуйста","позже","пойти","пока","пол","получить","помнить","понимать","понять","пор","пора","после","последний","посмотреть","посреди","потом","потому","почему","почти","правда","прекрасно","при","про","просто","против","процентов","пятнадцатый","пятнадцать","пятый","пять","работа","работать","раз","разве","рано","раньше","ребенок","решить","россия","рука","русский","ряд","рядом","с","сам","сама","сами","самим","самими","самих","само","самого","самой","самом","самому","саму","самый","свет","свое","своего","своей","свои","своих","свой","свою","сделать","сеаой","себе","себя","сегодня","седьмой","сейчас","семнадцатый","семнадцать","семь","сидеть","сила","сих","сказал","сказала","сказать","сколько","слишком","слово","случай","смотреть","сначала","снова","со","собой","собою","советский","совсем","спасибо","спросить","сразу","стал","старый","стать","стол","сторона","стоять","страна","суть","считать","т","та","так","такая","также","таки","такие","такое","такой","там","твой","твоя","твоё","те","тебе","тебя","тем","теми","теперь","тех","то","тобой","тобою","товарищ","тогда","того","тоже","только","том","тому","тот","тою","третий","три","тринадцатый","тринадцать","ту","туда","тут","ты","тысяч","у","увидеть","уж","уже","улица","уметь","утро","хороший","хорошо","хотеть","хоть","хотя","хочешь","час","часто","часть","чаще","чего","человек","чем","чему","через","четвертый","четыре","четырнадцатый","четырнадцать","что","чтоб","чтобы","чуть","шестнадцатый","шестнадцать","шестой","шесть","эта","эти","этим","этими","этих","это","этого","этой","этом","этому","этот","эту","я",
  "、","。","〈","〉","《","》","一","一切","一则","一方面","一旦","一来","一样","一般","七","万一","三","上下","不仅","不但","不光","不单","不只","不如","不怕","不惟","不成","不拘","不比","不然","不特","不独","不管","不论","不过","不问","与","与其","与否","与此同时","且","两者","个","临","为","为了","为什么","为何","为着","乃","乃至","么","之","之一","之所以","之类","乌乎","乎","乘","九","也","也好","也罢","了","二","于","于是","于是乎","云云","五","人家","什么","什么样","从","从而","他","他人","他们","以","以便","以免","以及","以至","以至于","以致","们","任","任何","任凭","似的","但","但是","何","何况","何处","何时","作为","你","你们","使得","例如","依","依照","俺","俺们","倘","倘使","倘或","倘然","倘若","借","假使","假如","假若","像","八","六","兮","关于","其","其一","其中","其二","其他","其余","其它","其次","具体地说","具体说来","再者","再说","冒","冲","况且","几","几时","凭","凭借","则","别","别的","别说","到","前后","前者","加之","即","即令","即使","即便","即或","即若","又","及","及其","及至","反之","反过来","反过来说","另","另一方面","另外","只是","只有","只要","只限","叫","叮咚","可","可以","可是","可见","各","各个","各位","各种","各自","同","同时","向","向着","吓","吗","否则","吧","吧哒","吱","呀","呃","呕","呗","呜","呜呼","呢","呵","呸","呼哧","咋","和","咚","咦","咱","咱们","咳","哇","哈","哈哈","哉","哎","哎呀","哎哟","哗","哟","哦","哩","哪","哪个","哪些","哪儿","哪天","哪年","哪怕","哪样","哪边","哪里","哼","哼唷","唉","啊","啐","啥","啦","啪达","喂","喏","喔唷","嗡嗡","嗬","嗯","嗳","嘎","嘎登","嘘","嘛","嘻","嘿","四","因","因为","因此","因而","固然","在","在下","地","多","多少","她","她们","如","如上所述","如何","如其","如果","如此","如若","宁","宁可","宁愿","宁肯","它","它们","对","对于","将","尔后","尚且","就","就是","就是说","尽","尽管","岂但","己","并","并且","开外","开始","归","当","当着","彼","彼此","往","待","得","怎","怎么","怎么办","怎么样","怎样","总之","总的来看","总的来说","总的说来","总而言之","恰恰相反","您","慢说","我","我们","或","或是","或者","所","所以","打","把","抑或","拿","按","按照","换句话说","换言之","据","接着","故","故此","旁人","无宁","无论","既","既是","既然","时候","是","是的","替","有","有些","有关","有的","望","朝","朝着","本","本着","来","来着","极了","果然","果真","某","某个","某些","根据","正如","此","此外","此间","毋宁","每","每当","比","比如","比方","沿","沿着","漫说","焉","然则","然后","然而","照","照着","甚么","甚而","甚至","用","由","由于","由此可见","的","的话","相对而言","省得","着","着呢","矣","离","第","等","等等","管","紧接着","纵","纵令","纵使","纵然","经","经过","结果","给","继而","综上所述","罢了","者","而","而且","而况","而外","而已","而是","而言","能","腾","自","自个儿","自从","自各儿","自家","自己","自身","至","至于","若","若是","若非","莫若","虽","虽则","虽然","虽说","被","要","要不","要不是","要不然","要么","要是","让","论","设使","设若","该","诸位","谁","谁知","赶","起","起见","趁","趁着","越是","跟","较","较之","边","过","还是","还有","这","这个","这么","这么些","这么样","这么点儿","这些","这会儿","这儿","这就是说","这时","这样","这边","这里","进而","连","连同","通过","遵照","那","那个","那么","那么些","那么样","那些","那会儿","那儿","那时","那样","那边","那里","鄙人","鉴于","阿","除","除了","除此之外","除非","随","随着","零","非但","非徒","靠","顺","顺着","首先","︿","！","＃","＄","％","＆","（","）","＊","＋","，","０","１","２","３","４","５","６","７","８","９","：","；","＜","＞","？","＠","［","］","｛","｜","｝","～","￥",
  "a","aby","aj","ako","aký","ale","alebo","ani","avšak","ba","bez","buï","cez","do","ho","hoci","i","ich","im","ja","jeho","jej","jemu","ju","k","kam","kde","kedže","keï","kto","ktorý","ku","lebo","ma","mi","mne","mnou","mu","my","mòa","môj","na","nad","nami","neho","nej","nemu","nich","nielen","nim","no","nám","nás","náš","ním","o","od","on","ona","oni","ono","ony","po","pod","pre","pred","pri","s","sa","seba","sem","so","svoj","taký","tam","teba","tebe","tebou","tej","ten","ti","tie","to","toho","tomu","tou","tvoj","ty","tá","tým","v","vami","veï","vo","vy","vám","vás","váš","však","z","za","zo","a","èi","èo","èí","òom","òou","òu","že",
  "այդ","այլ","այն","այս","դու","դուք","եմ","են","ենք","ես","եք","է","էի","էին","էինք","էիր","էիք","էր","ըստ","թ","ի","ին","իսկ","իր","կամ","համար","հետ","հետո","մենք","մեջ","մի","ն","նա","նաև","նրա","նրանք","որ","որը","որոնք","որպես","ու","ում","պիտի","վրա","և",
  "а","автентичен","аз","ако","ала","бе","без","беше","би","бивш","бивша","бившо","бил","била","били","било","благодаря","близо","бъдат","бъде","бяха","в","вас","ваш","ваша","вероятно","вече","взема","ви","вие","винаги","внимава","време","все","всеки","всички","всичко","всяка","във","въпреки","върху","г","ги","главен","главна","главно","глас","го","година","години","годишен","д","да","дали","два","двама","двамата","две","двете","ден","днес","дни","до","добра","добре","добро","добър","докато","докога","дори","досега","доста","друг","друга","други","е","евтин","едва","един","една","еднаква","еднакви","еднакъв","едно","екип","ето","живот","за","забавям","зад","заедно","заради","засега","заспал","затова","защо","защото","и","из","или","им","има","имат","иска","й","каза","как","каква","какво","както","какъв","като","кога","когато","което","които","кой","който","колко","която","къде","където","към","лесен","лесно","ли","лош","м","май","малко","ме","между","мек","мен","месец","ми","много","мнозина","мога","могат","може","мокър","моля","момента","му","н","на","над","назад","най","направи","напред","например","нас","не","него","нещо","нея","ни","ние","никой","нито","нищо","но","нов","нова","нови","новина","някои","някой","няколко","няма","обаче","около","освен","особено","от","отгоре","отново","още","пак","по","повече","повечето","под","поне","поради","после","почти","прави","пред","преди","през","при","пък","първата","първи","първо","пъти","равен","равна","с","са","сам","само","се","сега","си","син","скоро","след","следващ","сме","смях","според","сред","срещу","сте","съм","със","също","т","т.н.","тази","така","такива","такъв","там","твой","те","тези","ти","то","това","тогава","този","той","толкова","точно","три","трябва","тук","тъй","тя","тях","у","утре","харесва","хиляди","ч","часа","че","често","чрез","ще","щом","юмрук","я","як",
  "web", "app", "https","com","news","www","https www","twitter","youtube","facebook", "ly","bit", "bit ly", "instagram", "channel", "http", "subscribe"]

