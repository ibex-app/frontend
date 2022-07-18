import { Popover } from "antd";
import { useContext, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { TaxonomyContext } from "../../components/taxonomy/TaxonomyContext";
import { stopWords, textContainsStringFromSet } from "../../shared/Utils";
import { Suggestions } from "./Suggestions";

type Input = {
  text: string
}

const lengthOfTextForShowMore = 80;
const regex = /[a-zA-Z]/;

export const Text = ({ text }: Input) => {
  const location = useLocation();
  const taxonomyContext = useContext(TaxonomyContext);
  const [displayFull, setDisplayFull] = useState(false);

  const splitted = text.trim().split(/\s+/);

  const getText = (text: string, index: number) => {
    if (!text.match(regex) || text.match(regex)?.length == 0) return text + " ";
    if (stopWords.includes(text.toLowerCase())) return text + " ";

    const highlight = isTaxonomy ? textContainsStringFromSet(text, taxonomyContext.highlightWords) : false;

    return <>
      {isTaxonomy
        ? <Suggestions text={text} highlight={highlight} index={index} selection={taxonomyContext.hitsCountSelection} />
        : text + " "}
    </>
  }

  const isTaxonomy = useMemo(() => {
    return location.pathname.includes("taxonomy");
  }, [location])

  return <div className="post-content">
    {displayFull ? splitted.map(getText) : splitted.slice(0, lengthOfTextForShowMore).map(getText)}
    {splitted.length >= lengthOfTextForShowMore && <a
      style={{ color: "blue" }}
      onClick={() => setDisplayFull(!displayFull)}>
      {displayFull ? "Show Less" : "Show More"}
    </a>}
  </div>
}