import { Col, Row, Space } from "antd";
import { PostType } from "../../types/common";

import "./post.css";
import { platformIcon } from "../../shared/Utils";
import { Text } from "./Text";

export const Post = ({ post }: { post: PostType }) => {
  const { title, text, created_at, image_url, url, platform } = post;

  return <Row className="post">
    <Col span={16}>
      <Space direction="vertical">
        <div>
          <h1>{title}</h1>
          {created_at.$date && <h3>{new Date(created_at.$date).toLocaleDateString()}</h3>}
        </div>
        <Text text={text} />
        <span>{platform && platformIcon(platform)} <a href={url}>{url}</a></span>
      </Space>
    </Col>
    <Col span={4} offset={4}>
      <img src={image_url}></img>
    </Col>

  </Row>
}