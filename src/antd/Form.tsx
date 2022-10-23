import { Button, Form, Row, Space } from "antd";
import { lensPath, view } from "ramda";
import { Link } from "react-router-dom";
import { getElem } from "./utils/ElementGetter";

export const FormComponent = ({ formData, className, formValues, onValuesChange, onSubmit, submitDisabled }: any) => {
  const { title, redirect, children } = formData;

  return (
    <Form className={className} onValuesChange={onValuesChange} layout="vertical" onFinish={onSubmit}>
      <div className="tax-title-line">
        <div className="tax-mid">{title} <Link to='/'>              <Button>Exit</Button>            </Link> </div>
      </div>
      <Row justify="center" className="tax-scroll">
        <Space className="tax-mid mt-20" direction="vertical" size="middle">
          {children.map((el: any) => {
            const { id, hide } = el;
            if (hide) {
              const lensValue = view(lensPath(hide.lens), formValues);
              if (lensValue !== hide.value) return;
            }

            return <Space key={id} size="middle" direction="vertical" style={{ display: 'flex' }}>
              {getElem(el)}
              {/* <div className="tax-line"></div> */}
            </Space>
          }
          )
          }

          {redirect &&
            <Button type="primary" htmlType="submit" disabled={submitDisabled}>
              Next
            </Button>
          }
        </Space>
      </Row>
    </Form>
  );
}
