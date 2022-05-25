import { Modal, Popover, Space } from "antd";
import { useContext, useState } from "react";
import { TaxonomyContext } from "../../components/taxonomy/TaxonomyContext";
import { boolOperators } from "../../shared/Utils";
import { drawFilterItem } from "../../shared/Utils/Taxonomy";
import { HitsCountTableItem } from "../../types/taxonomy"

type Input = {
  text: string,
  selection?: HitsCountTableItem[],
  index?: number,
  highlight: boolean
}

type Output = {
  element: JSX.Element,
  text: string
}

export const Suggestions = ({ text, selection, highlight, index }: Input) => {
  const [selectedItem, setSelectedItem] = useState<Output>({ element: <></>, text: "" });
  const { setUserSelection } = useContext(TaxonomyContext);

  const Content = ({ text }: { text: string }) => <>
    <Space direction="vertical">
      {selection?.map((item) => boolOperators.map(op => {
        const elem = <>{drawFilterItem(item)} <span className="op">{op.toUpperCase()}</span> {text}</>;
        return <span
          key={op}
          onClick={() => setUserSelection(`${item.search_term} ${op} ${text}`)}>
          {elem}
        </span>
      }
      ))}
    </Space>
    {/* <Modal visible={!!selectedItem.text}>
      <h1>Updating your search results with</h1>
      <>{selectedItem.element}</>
    </Modal> */}
  </>

  return <>
    <Popover
      trigger={"click"}
      title="Search For"
      content={
        <Content text={text} />
      }>
      <span
        key={`${text}-${index}`}
        className={highlight ? "highlight" : ""}
      >
        {text + " "}
      </span>
    </Popover>

  </>
}