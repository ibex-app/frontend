import moment from "moment";
import { match } from "ts-pattern";
import { FilterElement } from "../../../types/form";
import { DateInterval } from "../../date-interval/DateInterval";
import { Checkbox } from "./Checkbox";
import { Date } from "./Date";
import { Tag } from "./Tag";
import { Text } from "./Text";
import { TextBox } from "./Textbox";

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
    .otherwise(() => {
      console.error(`Invalid component name ${el.type}`);
      return <></>
    })
}