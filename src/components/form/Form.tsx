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

  const component = match(el.type)
    .with("date_interval", () => <DateInterval data={el} onChange={onChange} />)
    .with("tag", () => <Tag data={el} onChange={onChange} />)
    .with("date", () => <Date data={el} onChange={onChange} />)
    .with("text", () => <Text data={el} onChange={onChange} />)
    .with("textbox", () => <TextBox data={el} onChange={onChange} />)
    .with("checkbox", () => <Checkbox data={el} onChange={onChange} />)
    .with("file_upload", () => <FileUpload  data={el} onChange={onChange} />)
    .otherwise(() => {
      console.error(`Invalid component name ${el.type}`);
      return <></>
    })

  return el.tip
    ? <>{component}
      <div className="tax-tip"><FontAwesomeIcon icon={faLightbulb} />{el.tip}</div>
    </>
    : component
}