import { useContext, useState } from "react";
import { TaxonomyContext } from "../../components/taxonomy/TaxonomyContext";
import { stopWords, textContainsStringFromSet } from "../../shared/Utils";
import { Suggestions } from "./Suggestions";

type Input = {
  text: string,
  allowSuggestions?: boolean,
}

const lengthOfTextForShowMore = 80;
const regex = /[a-zA-Z]/;

export const Text = ({ text, allowSuggestions }: Input) => {
  const taxonomyContext = useContext(TaxonomyContext);
  const [displayFull, setDisplayFull] = useState(false);

  const splitted = text.trim().split(/\s+/);

  const getText = (text: string, index: number) => {
    if (!text.match(regex) || text.match(regex)?.length == 0) return text + " ";
    if (stopWords.includes(text.toLowerCase())) return text + " ";

    const highlight = allowSuggestions ? textContainsStringFromSet(text, taxonomyContext.highlightWords) : false;

    return <>
      {allowSuggestions
        ? <Suggestions text={text} highlight={highlight} index={index} selection={taxonomyContext.hitsCountSelection} />
        : text + " "}
    </>
  }

  return <div className="post-content">
    {displayFull ? splitted.map(getText) : splitted.slice(0, lengthOfTextForShowMore).map(getText)}
    {splitted.length >= lengthOfTextForShowMore && <a
      style={{ color: "blue" }}
      onClick={() => setDisplayFull(!displayFull)}>
      {displayFull ? "Show Less" : "Show More"}
    </a>}
  </div>
}