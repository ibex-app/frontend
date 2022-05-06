import { Checkbox, DatePicker, Input, Upload } from "antd";
import FormItem from "antd/lib/form/FormItem";
import TextArea from "antd/lib/input/TextArea";
import { Typeahead } from "react-bootstrap-typeahead";
import { match } from "ts-pattern";
import FileUpload from "../../components/form/inputs/FileUpload";
import { FilterElement } from "../../types/form";
import "antd/es/date-picker/style/css";
import { DateInterval } from "../../components/form/inputs/DateInterval";
import { Uploader } from "../Uploader";

export const getElem = (element: FilterElement): any => {
  const { type, id, rules, children, values, placeHolder, disabled, title } = element;

  return <FormItem name={id} label={title} rules={rules}>
    {match(type)
      .with("date_interval", () => children && <DateInterval children={children} />)
      .with("date", () => <DatePicker placeholder={placeHolder} disabled={disabled} />)
      .with("tag", () => <Typeahead multiple options={values} />)
      .with("text", () => <Input />)
      .with("textbox", () => <TextArea />)
      .with("checkbox-group", () =>
        <Checkbox.Group>
          {children!.map(({ id, label }) => <Checkbox value={id}>{label}</Checkbox>)}
        </Checkbox.Group>
      )
      .with("file_upload", () => <FileUpload />)
      .with("uploader", () => <Uploader element={element} />)
      .otherwise(() => {
        console.error(`Invalid component name ${type}`);
        return <></>
      })}
  </FormItem>
}
