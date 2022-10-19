import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormElement } from "../../types/form";

export const hitsCountFormItem: FormElement = {
  id: 0,
  type: "text",
  placeholder: "Search term",
  prefix: <FontAwesomeIcon icon={faMagnifyingGlass} />
}

export const accountHitsCountFormItem: FormElement = {
  id: 0,
  type: "tag",
  placeholder: "Account name",
  prefix: <FontAwesomeIcon icon={faMagnifyingGlass} />,
  requestData: "search_account"
}