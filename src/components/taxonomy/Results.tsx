import { useLocation } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSliders } from '@fortawesome/free-solid-svg-icons'

import './Taxonomy.css';
import { isEmpty, map, pipe } from "ramda";
import { Button, Col, Row, Space } from "antd";
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

export const TaxonomyResults = () => {
  const { search } = useLocation();
  const [hitsCount, setHitsCount_] = useState<HitsCountOutput>();
  const [keywordsFilter, setKeywordsFilter] = useState<string[] | null>(null);
  const [userSelection, setUserSelection] = useState<string>();
  const [filter, setFilter] = useState({});
  const [buttonsDisabled, setButtonsDisabled] = useState(false);

  const navWithQuery = useNavWithQuery();

  const monitor_id = useMemo(() => new URLSearchParams(search).get('monitor_id') || "", [search]);
  const { mutateAsync: updateMonitor } = useUpdateMonitorMutation(monitor_id);

  const { data: monitorRes, isLoading: monitorLoading } = useMonitorState(monitor_id);

  const monitor = useMemo(() => monitorRes?.monitor, [monitorRes]);

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
    const search_terms = hitsCount.all.map((search_term: any) => ({
      id: search_term._id,
      term: search_term.title
    }));

    updateMonitor({ id: monitor_id, search_terms }).then(() => setButtonsDisabled(false));;
  }, [hitsCount?.all, monitor_id, updateMonitor]);

  const filters = useMemo(() => {
    const filter = FilterData.data[0];
    const list = hitsCount?.platforms?.map((platform, id) => ({
      id, label: capitalize(platform), _id: platform
    }))

    return [{ ...filter, selected: list, list }]
  }, [hitsCount?.platforms])

  useEffect(() => {
    hitsCount?.selected?.length ?
      pipe(
        map(({ title }: HitsCountTableItem) => title),
        (res) => res && setKeywordsFilter
      )(hitsCount.selected) : setKeywordsFilter([]);
  }, [hitsCount]);

  return (
    <TaxonomyContext.Provider value={{
      highlightWords,
      hitsCountSelection: hitsCount?.selected,
      userSelection,
      setUserSelection
    }}>
      <Row className="tax-cont">
        <Col span={8} className="fixed-col">
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
                <Button disabled={buttonsDisabled} onClick={() => {
                  setButtonsDisabled(true)
                  navWithQuery('/taxonomy/data-collection')
                }}>
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
            {keywordsFilter && !monitorLoading && <Posts
              allowSuggestions={type === 'search_terms' ? true : false}
              key="postsTaxonomy"
              filter={{ ...filter, monitor_id, search_terms: keywordsFilter }}
              allowRedirect={false}
              shuffle={true}
            />}
          </Space>
        </Col>
      </Row>
    </TaxonomyContext.Provider>
  )
}

