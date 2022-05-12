import { faFacebook, faTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Row, Space } from "antd";
import { PostType } from "../../types/common";
import ReactShowMoreText from "react-show-more-text";

import "./post.css";
import { match } from "ts-pattern";

export const Post = ({ post }: { post: PostType }) => {
  const { title, text, created_at, image_url, url, platform } = post;
  const platformIcon = match(platform)
    .with("facebook", () => faFacebook)
    .with("twitter", () => faTwitter)
    .with("youtube", () => faYoutube)
    .otherwise(() => undefined)

  return <Row className="post">
    <Col span={16}>
      <Space direction="vertical">
        <div>
          <h1>{title}</h1>
          {created_at.$date && <h3>{new Date(created_at.$date).toLocaleDateString()}</h3>}
        </div>
        <ReactShowMoreText
          lines={4}
          more={"Show More"}
          less={"Show Less"}
          className="post-text"
          anchorClass="show-more"
        >{text}</ReactShowMoreText>
        <span>{platformIcon && <FontAwesomeIcon icon={platformIcon} />} <a href={url}>{url}</a></span>
      </Space>
    </Col>
    <Col span={4} offset={4}>
      <img src={image_url}></img>
    </Col>

  </Row>
}