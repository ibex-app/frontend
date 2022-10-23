import { useLocation } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSliders } from '@fortawesome/free-solid-svg-icons'

import './Taxonomy.css';
import { map, pipe } from "ramda";
import { Button, Col, Modal, Row, Space } from "antd";
import { drawFilterItem } from "../../shared/Utils/Taxonomy";
import { Posts } from "../../antd/Posts";
import { HitsCount, HitsCountOutput } from "../../antd/taxonomy/HitsCount";
import { Recommendations } from "../../antd/taxonomy/Recomendations";
import { TaxonomyContext } from "./TaxonomyContext";
import { capitalize, getAllKeywordsWithoutOperator, useNavWithQuery } from "../../shared/Utils";
import { Filter } from "../filter/Filter";
import FilterData from '../../data/taxonomy/filter.json';
import { HitsCountTableItem } from '../../types/hitscount';
import { useMonitorState } from '../../state/useMonitorState';
import { useUpdateMonitorMutation } from '../../state/useUpdateMonitorMutation';
import { FormElement } from '../../types/form';
import { hitsCountIsOverLimit } from '../../antd/taxonomy/utils';

const modalError = Modal.error;

export const TaxonomyResults = () => {
  const { search } = useLocation();
  const [hitsCount, setHitsCount_] = useState<HitsCountOutput>();
  const [keywordsFilter, setKeywordsFilter] = useState<string[] | null>(null);
  const [userSelection, setUserSelection] = useState<string>();
  const [filter, setFilter] = useState<object | null>(null);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);

  const navWithQuery = useNavWithQuery();

  const monitor_id = useMemo(() => new URLSearchParams(search).get('monitor_id') || "", [search]);
  const { mutateAsync: updateMonitor } = useUpdateMonitorMutation(monitor_id);

  const { data: monitor, isLoading: monitorLoading } = useMonitorState(monitor_id);

  const type = useMemo(() => hitsCount?.type, [hitsCount]);
  const highlightWords = useMemo(() => {
    const searchTerms = hitsCount?.all?.map(({ title }) => title);
    return searchTerms ? getAllKeywordsWithoutOperator(searchTerms) : [];
  }, [hitsCount?.all]);

  const setHitsCount = useCallback((newHitsCount: HitsCountOutput) => {
    setHitsCount_({ ...hitsCount, ...newHitsCount });
  }, [hitsCount]);

  const updateHitsCount = useCallback(() => {
    if (!hitsCount?.all) return;
    setButtonsDisabled(true);

    if (type === 'accounts') {
      console.log(hitsCount.all)
      // updateMonitor(hitsCount.all).then(() => setButtonsDisabled(false))

      return;
    }

    const search_terms = hitsCount.all.map((search_term: any) => ({
      id: search_term.id,
      term: search_term.title
    }));

    updateMonitor({ id: monitor_id, search_terms }).then(() => setButtonsDisabled(false));;
  }, [hitsCount?.all, monitor_id, updateMonitor, type]);

  const filters = useMemo(() => {
    let filterArr: FormElement[] = [];

    if (monitor?.platforms?.length) {
      const platformsData = FilterData.data[0];
      const list = monitor?.platforms?.map((platform) => ({
        label: capitalize(platform)
      }))

      filterArr.push({ ...platformsData, list, selected: list });
    }

    return filterArr
  }, [monitor])

  const hitsCountSelectionIds = useMemo(() => ({
    [type === 'accounts' ? 'account_ids' : 'search_term_ids']: hitsCount?.selected ? hitsCount?.selected?.map(({ id }) => id) : []
  }), [hitsCount?.selected, type]);

  useEffect(() => {
    hitsCount?.selected?.length ?
      pipe(
        map(({ title }: HitsCountTableItem) => title),
        (res) => res && setKeywordsFilter
      )(hitsCount.selected) : setKeywordsFilter([]);
  }, [hitsCount]);

  const dataCollectionEnabled = useMemo(() => hitsCount?.is_loading === false && hitsCount?.all?.length, [hitsCount]);

  const runDataCollection = useCallback(() => {
    if (!hitsCount?.pristine) {
      modalError({
        title: 'Error',
        content: 'You have unsaved changes. Please update monitor before running the data collection.',
      });
      return;
    }

    if (hitsCountIsOverLimit(hitsCount?.all)) {
      modalError({
        title: 'Error',
        content: 'Posts count for some of the search terms exceeds allowed quota. Please modify the list of keywords.'
      })

      return;
    }

    setButtonsDisabled(true)
    navWithQuery('/taxonomy/data-collection')
  }, [navWithQuery, hitsCount?.all, hitsCount?.pristine]);

  return (
    <TaxonomyContext.Provider value={{
      highlightWords,
      hitsCountSelection: hitsCount?.selected,
      userSelection,
      setUserSelection
    }}>
      <Row className="tax-cont">
        <Col span={8} className="fixed-col" style={{ height: 'calc(99vh - 62px)', overflow: 'auto' }}>
          <Space direction="vertical" style={{ display: "flex" }}>
            <div className="leftbox-title"> <span>{monitor?.title}</span> <FontAwesomeIcon icon={faSliders} /></div>
            <HitsCount monitor_id={monitor_id} toParent={setHitsCount} />
            {type === 'search_terms' && <Recommendations monitor_id={monitor_id} toParent={setHitsCount} />}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <Button disabled={hitsCount?.pristine || buttonsDisabled} onClick={() => updateHitsCount()}>
                Update Monitor
              </Button>
            </div>

            <div className="flex align-center align-middle">
              {
                <Button disabled={buttonsDisabled || !dataCollectionEnabled} onClick={runDataCollection}>
                  Run data collection
                </Button>
              }
              {/* <Link to="data-collection">Run data collection</Link> */}
            </div>
          </Space>
        </Col>
        <Col span={16} style={{ color: "#F4F4F5" }} className="flex align-center align-middle">
          <Space direction="vertical" className="full-height-width">
            <Filter data={filters} onChange={setFilter} />
            {!!hitsCount?.selected?.length && <Space className="flex search-header">
              Search results for {map(drawFilterItem, hitsCount.selected)}
            </Space>}
            {keywordsFilter && !monitorLoading && filter && <Posts
              allowSuggestions={type === 'search_terms' ? true : false}
              key="postsTaxonomy"
              filter={{ ...filter, monitor_id, search_terms: keywordsFilter, ...hitsCountSelectionIds }}
              allowRedirect={false}
              shuffle={true}
            />}
          </Space>
        </Col>
      </Row>
    </TaxonomyContext.Provider>
  )
}

