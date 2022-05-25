import { createContext } from "react";

export const TaxonomyContext = createContext<{ highlightWords: string[] }>({
  highlightWords: []
});