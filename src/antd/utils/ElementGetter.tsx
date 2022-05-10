import { Checkbox, DatePicker, Input } from "antd";
import FormItem from "antd/lib/form/FormItem";
import TextArea from "antd/lib/input/TextArea";
import { match } from "ts-pattern";
import FileUpload from "../FileUpload";
import { FormElement } from "../../types/form";
import "antd/es/date-picker/style/css";
import { DateInterval } from "../DateInterval";
import { Uploader } from "../Uploader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { Tag } from "../Select/Select";
import { dateFormat } from "../../shared/Utils";
import moment from "antd/node_modules/moment";

export const getElem = (element: FormElement): any => {
  const { type, id, rules, children, placeholder, disabled, title, label, tip, value, list } = element;

  return <FormItem name={id} label={title || label} rules={rules} style={{ marginBottom: "5px" }}>
    {match(type)
      .with("date_interval", () => children && <DateInterval children={children} />)
      .with("date", () =>
        <DatePicker
          placeholder={placeholder}
          disabled={disabled}
          defaultValue={value ? moment(value, dateFormat) : moment()}
          format={dateFormat} />
      )
      .with("tag", () => <Tag el={element} />)
      .with("text", () => <Input />)
      .with("textbox", () => <TextArea />)
      .with("checkbox", () => <Checkbox />)
      .with("checkbox-group", () =>
        <Checkbox.Group>
          {children!.map(({ id, label }) => <Checkbox key={`Check-${id}`} value={id}>{label}</Checkbox>)}
        </Checkbox.Group>
      )
      .with("file_upload", () => <FileUpload />)
      .with("uploader", () => <Uploader element={element} />)
      .otherwise(() => {
        console.error(`Invalid component name ${type}`);
        return <></>
      })}
    {tip && <div className="tax-tip"><FontAwesomeIcon icon={faLightbulb} />{tip}</div>}
  </FormItem>
}
