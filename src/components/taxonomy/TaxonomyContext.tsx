import { createContext } from "react";
import { HitsCountTableItem } from "../../types/taxonomy";

type TaxonomyContext = {
  highlightWords: string[],
  hitsCountSelection?: HitsCountTableItem[]
  userSelection?: string,
  setUserSelection: (s: string) => void
}

export const TaxonomyContext = createContext<TaxonomyContext>({
  highlightWords: [],
  hitsCountSelection: [],
  userSelection: "",
  setUserSelection: (s: string) => { }
});