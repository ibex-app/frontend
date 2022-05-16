import { Button, Form, Row, Space } from "antd";
import { Link } from "react-router-dom";
import { getElem } from "./utils/ElementGetter";

export const FormComponent = ({ formData, className, formValues, onValuesChange }: any) => {
  const { title, redirect, children } = formData;

  return (
    <Form className={className} onValuesChange={onValuesChange} layout="vertical">
      <div className="tax-title-line">
        <div className="tax-mid">{title}</div>
      </div>
      <Row justify="center">
        <Space className="tax-mid mt-20" direction="vertical" size="middle">
          {children.map((el: any) => (
            <Space key={el.id} size="middle" direction="vertical" style={{ display: 'flex' }}>
              {getElem(el)}
              <div className="tax-line"></div>
            </Space>
          ))
          }

          {redirect &&
            <Link to={redirect}>
              <Button>Next</Button>
            </Link>
          }
        </Space>
      </Row>
    </Form>
  );
}
