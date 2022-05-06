import { Checkbox, DatePicker, Input, Select, Upload } from "antd";
import FormItem from "antd/lib/form/FormItem";
import TextArea from "antd/lib/input/TextArea";
import { Typeahead } from "react-bootstrap-typeahead";
import { match } from "ts-pattern";
import FileUpload from "../FileUpload";
import { FormElement } from "../../types/form";
import "antd/es/date-picker/style/css";
import { DateInterval } from "../DateInterval";
import { Uploader } from "../Uploader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";

export const getElem = (element: FormElement): any => {
  const { type, id, rules, children, placeholder, disabled, title, tip, list } = element;

  return <FormItem label={title} rules={rules}>
    {match(type)
      .with("date_interval", () => children && <DateInterval children={children} />)
      .with("date", () => <DatePicker placeholder={placeholder} disabled={disabled} />)
      .with("tag", () => <Typeahead id={id} multiple options={list} allowNew={element.allowNew} />)
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
