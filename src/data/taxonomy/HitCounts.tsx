import { faFacebook, faTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { faMagnifyingGlass, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { drawFilterItem } from "../../shared/Utils/Taxonomy";
import { FormElement } from "../../types/form";
import { Form, Input, Space, Table } from "antd";

export const hitsCountFormItem: FormElement = {
  id: 0,
  type: "text",
  placeholder: "Search in your list",
  prefix: <FontAwesomeIcon icon={faMagnifyingGlass} />
}

export const hitCountCols = [
  {
    title: "Keyword",
    dataIndex: "search_term",
    key: "search_term",
    render: (text: string) => text && drawFilterItem({ search_term: text })
  },
  {
    title: <FontAwesomeIcon icon={faFacebook} />,
    dataIndex: "facebook",
    key: "facebook",
  },
  {
    title: <FontAwesomeIcon icon={faYoutube} />,
    dataIndex: "youtube",
    key: "youtube",
  },
  {
    title: <FontAwesomeIcon icon={faTwitter} />,
    dataIndex: "twitter",
    key: "twitter",
  },
  {
    title: '',
    key: 'action',
    render: (_: any, record: any) => (
      // <Space size="middle" onClick=''>
        <FontAwesomeIcon icon={faTrashCan} />
      // </Space>
    ),
  }
];