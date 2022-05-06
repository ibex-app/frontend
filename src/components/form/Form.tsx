import moment from "moment";
import { match } from "ts-pattern";
import { FilterElement } from "../../types/form";
import { DateInterval } from "./inputs/DateInterval";
import { Checkbox } from "./inputs/Checkbox";
import { Date } from "./inputs/Date";
import { Tag } from "./inputs/Tag";
import { Text } from "./inputs/Text";
import { TextBox } from "./inputs/Textbox";
import FileUpload from "./inputs/FileUpload";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLightbulb } from '@fortawesome/free-solid-svg-icons'

export const getElem = (el: FilterElement, onChange: any) => {
  if (el.value === 'today') {
    el.value = moment().format("YYYY-MM-DD")
  }

  const getComponent = (el: FilterElement): any => match(el.type)
    .with("list", () => el.children!.map((elem) => {
      return (<span>
        {getComponent(elem)} {elem.label}
      </span>)
    }))
    // .with("date_interval", () => <DateInterval data={el} onChange={onChange} />)
    .with("tag", () => <Tag data={el} onChange={onChange} />)
    .with("date", () => <Date data={el} onChange={onChange} />)
    .with("text", () => <Text data={el} onChange={onChange} />)
    .with("textbox", () => <TextBox data={el} onChange={onChange} />)
    .with("checkbox", () => <Checkbox data={el} onChange={(val) => onChange(el)(val)} />)
    // .with("file_upload", () => <FileUpload data={el} onChange={onChange} />)
    // .with("search_terms", () => <SearchTerms formData={el} />)
    .otherwise(() => {
      console.error(`Invalid component name ${el.type}`);
      return <></>
    })

  const component = getComponent(el);

  return el.tip
    ? <>{component}
      <div className="tax-tip"><FontAwesomeIcon icon={faLightbulb} />{el.tip}</div>
    </>
    : component
}