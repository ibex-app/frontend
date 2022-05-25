import { useContext, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { TaxonomyContext } from "../../components/taxonomy/TaxonomyContext";
import { textContainsStringFromSet } from "../../shared/Utils";

type Input = {
  text: string
}

const lengthOfTextForShowMore = 80;

export const Text = ({ text }: Input) => {
  const location = useLocation();
  const taxonomyContext = useContext(TaxonomyContext);
  const [displayFull, setDisplayFull] = useState(false);

  const splitted = text.trim().split(/\s+/);

  const getText = (text: string, index: number) => {
    const highlight = isTaxonomy ? textContainsStringFromSet(text, taxonomyContext.highlightWords) : false;
    return <span key={`${text}-${index}`} className={highlight ? "highlight" : ""}>{text} </span>
  }

  const isTaxonomy = useMemo(() => {
    return location.pathname.includes("taxonomy") && taxonomyContext.highlightWords.length > 0;
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