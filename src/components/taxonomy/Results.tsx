import * as E from "fp-ts/lib/Either";
import { useLocation } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSliders } from '@fortawesome/free-solid-svg-icons'

import './Taxonomy.css';
import { Get } from '../../shared/Http';
import { map, pipe } from "ramda";
import { Button, Col, Row, Space } from "antd";
import { HitsCountTableItem, Monitor, MonitorRespose } from "../../types/taxonomy";
import { drawFilterItem } from "../../shared/Utils/Taxonomy";
import { Posts } from "../../antd/Posts";
import { HitsCount, HitsCountOutput } from "../../antd/taxonomy/HitsCount";
import { Recommendations } from "../../antd/taxonomy/Recomendations";
import { TaxonomyContext } from "./TaxonomyContext";
import { capitalize, getAllKeywordsWithoutOperator, useNavWithQuery } from "../../shared/Utils";
import { Filter } from "../filter/Filter";
import FilterData from '../../data/taxonomy/filter.json';
import { useQueryClient } from 'react-query';
import { queries } from '../../shared/Queries';

export const TaxonomyResults = () => {
  const queryClient = useQueryClient();
  const { search } = useLocation();
  const [monitor, setMonitor] = useState<Monitor>();
  const [hitsCount, setHitsCount_] = useState<HitsCountOutput>();
  const [keywordsFilter, setKeywordsFilter] = useState<string[]>([]);
  const [userSelection, setUserSelection] = useState<string>();
  const [ismodified, setIsmodified] = useState<boolean>(false);
  const [filter, setFilter] = useState({});
  const [buttonsDisabled, setButtonsDisabled] = useState(false);

  const navWithQuery = useNavWithQuery();

  const monitor_id = useMemo(() => new URLSearchParams(search).get('monitor_id') || "", [search]);

  const highlightWords = useMemo(() => {
    const searchTerms = hitsCount?.all?.map(({ search_term }) => search_term);
    return searchTerms ? getAllKeywordsWithoutOperator(searchTerms) : [];
  }, [hitsCount?.all]);

  const setHitsCount = (newHitsCount: HitsCountOutput) => {
    if (hitsCount?.all && newHitsCount?.all && hitsCount?.all.length > 0
      && hitsCount?.all.length !== newHitsCount?.all.length) {
      setIsmodified(true)
    }

    setHitsCount_({ ...hitsCount, ...newHitsCount });
  }

  const updateHitsCount = () => {
    if (!hitsCount?.all) return;
    setButtonsDisabled(true);
    const search_terms = hitsCount.all.map(({ search_term }: any) => search_term);

    Get('update_monitor', { id: monitor_id, search_terms }).then(() => {
      Promise.all([
        queryClient.invalidateQueries(queries.posts({ monitor_id })),
        queryClient.invalidateQueries(queries.hitsCount(monitor_id))
      ]).then(() => setButtonsDisabled(false));
    });
  }

  const filters = useMemo(() => {
    const filter = FilterData.data[0];
    const list = hitsCount?.platforms?.map((platform, id) => ({
      id, label: capitalize(platform), _id: platform
    }))

    return [{ ...filter, selected: list, list }]
  }, [hitsCount?.platforms])

  useEffect(() => {
    !monitor_id && Get<MonitorRespose>('get_monitor', { id: monitor_id })
      .then(E.fold(console.error, ({ monitor }) => setMonitor(monitor)));
  }, [monitor_id]);

  useEffect(() => {
    hitsCount?.selected?.length ?
      pipe(
        map(({ search_term }: HitsCountTableItem) => search_term),
        setKeywordsFilter
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
            <Recommendations monitor_id={monitor_id} toParent={setHitsCount} />
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <Button disabled={!ismodified || !hitsCount?.all?.length || buttonsDisabled} onClick={() => updateHitsCount()}>
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
            <Posts
              key="postsTaxonomy"
              filter={{ ...filter, monitor_id, search_terms: keywordsFilter }}
              allowRedirect={false}
              shuffle={true}
            />
          </Space>
        </Col>
      </Row>
    </TaxonomyContext.Provider>
  )
}

