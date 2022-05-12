import { faFacebook, faTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const hitCountCols = [
  {
    title: "Keyword",
    dataIndex: "search_term",
    key: "search_term",
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
  }
];