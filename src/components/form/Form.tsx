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

export const getElem = (el: FilterElement, onChange: any) => {
  if (el.value === 'today') {
    el.value = moment().format("YYYY-MM-DD")
  }

  return match(el.type)
    .with("date_interval", () => <DateInterval data={el} onChange={onChange} />)
    .with("tag", () => <Tag data={el} onChange={onChange} />)
    .with("date", () => <Date data={el} onChange={onChange} />)
    .with("text", () => <Text data={el} onChange={onChange} />)
    .with("textbox", () => <TextBox data={el} onChange={onChange} />)
    .with("checkbox", () => <Checkbox data={el} onChange={onChange} />)
    .with("file_upload", () => <FileUpload />)
    .otherwise(() => {
      console.error(`Invalid component name ${el.type}`);
      return <></>
    })
}