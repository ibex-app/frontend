import { Space } from "antd";
import { pipe, prop, trim } from "ramda";
import { FilterElem, FilterElemPartial } from "../../types/taxonomy";
import { filterHasOperator } from "../Utils";

export const createFilterElem = ({ hasOp, s, op }: FilterElemPartial): FilterElem => {
  if (!hasOp || op === undefined) return { hasOp: false, left: s };
  const opStartIndex = s.toLowerCase().indexOf(op);
  const left = s.substring(0, opStartIndex);
  const right = s.substring(opStartIndex + op.length);

  return { hasOp, left: trim(left), right: trim(right), op: op.toUpperCase() };
}

// input HitsCountTableData
export const drawFilterItem = pipe<any, string, FilterElemPartial, FilterElem, JSX.Element>(
  prop('search_term'),
  filterHasOperator,
  createFilterElem,
  ({ hasOp, left, right, op }) =>
    hasOp ? <Space>
      <span className="keyword">{left}</span>
      <span className="op">{op}</span>
      <span className="keyword">{right}</span>
    </Space> : <span className="keyword">{left}</span>
)

// const [monitor, setMonitor]: any = useState();
  // const [existing, setExisting]: any = useState(false);
  // const [timeLeft, setTimeLeft]: any = useState(null);
  // const [searchParams, setSearchParams] = useSearchParams();
  // const navigate = useNavigate();
  // const [filters, setFilters]: any = useGlobalState('filters');
  // const { data }: { data: FormElement[] } = require('../../data/filter.json')


  // const finalize_form = (form: any) => {
  //     form.accounts = form.accounts || []
  //     form.search_terms = form.search_terms || []
  //     form.search_terms = form.search_terms.map((search_term: any) => search_term.customOption ? search_term.label : search_term)

  //     form.accounts = form.accounts.map((account: any) => ({
  //         platform: account.platform,
  //         platform_id: account.platform_id,
  //         title: account.title
  //     }))

  //     const data = {
  //         ...form,
  //         accounts: form.accounts.map((account: any) => ({
  //             platform: account.platform,
  //             platform_id: account.platform_id,
  //             title: account.title
  //         })),
  //     }

  //     delete data['date'];
  //     // delete data['languages'];
  //     return data;
  // }

  // const estimateTime = (form: any) => {
  //     const timeLeft = (form.search_terms.length || 1) * 8 * form.platforms.length
  //     console.log('estimateTime', timeLeft)
  //     setTimeLeft(timeLeft)
  //     return timeLeft
  // }

  // useEffect(() => {
  //     if (timeLeft === 0) {
  //         console.log("TIME LEFT IS 0");
  //         setTimeLeft(null)
  //     }

  //     // exit early when we reach 0
  //     if (!timeLeft) return;

  //     // save intervalId to clear the interval when the
  //     // component re-renders
  //     const intervalId = setInterval(() => {

  //         setTimeLeft(timeLeft - 1);
  //     }, 1000);

  //     // clear interval on re-render to avoid memory leaks
  //     return () => clearInterval(intervalId);
  //     // add timeLeft as a dependency to re-rerun the effect
  //     // when we update it
  // }, [timeLeft]);

  // useEffect(() => {
  //     setFilters({})
  //     let urlFilters: any = getFilters(data)
  //     if (urlFilters.monitor_id) {
  //         setExisting(true)
  //         const fetchData = Get('get_monitor', { id: urlFilters.monitor_id });
  //         fetchData.then((_data: Response<any>) => {
  //             let maybeData: any = E.getOrElse(() => [])(_data)
  //             if (!maybeData) return
  //             setMonitor(maybeData.monitor)
  //             // update({ "id": "title" })(maybeData.monitor.title)
  //         });
  //     } else {
  //         if (!form || monitor) return
  //         if (isObjectEmpty(form)) navigate('../init');
  //         const finalForm: any = finalize_form(form)
  //         estimateTime(finalForm)
  //         const createMonitor = Get('create_monitor', finalForm);

  //         createMonitor.then((_data: Response<any>) => {
  //             let _monitor: any = E.getOrElse(() => [])(_data);
  //             setSearchParams({ 'monitor_id': _monitor._id })
  //             setMonitor(_monitor)
  //         });
  //     }
  // }, [])

  // const timeOut = (time: number) => new Promise((resolve, reject) => {
  //     setTimeout(() => resolve(true), time)
  // })

  // useEffect(() => {
  //     console.log(timeLeft)
  // }, [timeLeft])

  // useEffect(() => {
  //     if (!monitor) return;
  //     const collectSample = !existing ? Get('collect_sample', { id: monitor._id }) : new Promise((resolve, reject) => resolve(true))

  //     const _timeLeft: number = !existing ? timeLeft : 0

  //     setTimeLeft(_timeLeft)

  //     collectSample
  //         .then(() => timeOut(_timeLeft))
  //         .then(() => {
  //             setFilters({
  //                 time_interval_to: monitor.date_to || moment().subtract(3, 'hour').format("YYYY-MM-DD"),
  //                 time_interval_from: monitor.date_from,
  //                 monitor_id: monitor._id
  //             });
  //             const getHitsCount = Get('get_hits_count', { id: monitor._id })
  //             return getHitsCount
  //         }).then((hitsCountResponce: Response<any>) => {
  //             let _hitsCountResponce = E.getOrElse(() => [])(hitsCountResponce);
  //             setHitsCount(_hitsCountResponce)
  //         })
  // }, [monitor])