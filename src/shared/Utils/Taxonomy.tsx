import { map, pipe, prop } from "ramda";
import { getWordList, WordList } from "../Utils";

// input HitsCountTableData
export const drawFilterItem: any = pipe<any, string, WordList, JSX.Element[]>(
  prop('title'),
  getWordList,
  map(({ type, keyword }) => <span className={type}>{keyword}</span>)
);

export const finalizeForm = ({ form1, form2 }: any) => {
  // console.log(444, form1, form2)
  return {
  ...form1,
  ...form2,
  date_from: form2.date_from.toISOString(),
  date_end: form2.date_end?.toISOString(),
  search_terms: form2.search_terms?.map((search_term: any) => search_term.label),
  accounts: form2.accounts?.map((account: any) => ({
    platform: account.platform,
    platform_id: account.platform_id,
    title: account.label
  })),
}};

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


  //     }
  // }, [])

  // const timeOut = (time: number) => new Promise((resolve, reject) => {
  //     setTimeout(() => resolve(true), time)
  // })

  // useEffect(() => {
  //     if (!monitor) return;
      // const collectSample = !existing ? Get('collect_sample', { id: monitor._id }) : new Promise((resolve, reject) => resolve(true))

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