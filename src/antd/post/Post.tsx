import { Col, Row, Space } from "antd";
import { PostType } from "../../types/common";

import "./post.css";
import { platformIcon } from "../../shared/Utils";
import { Text } from "./Text";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp, faShare, faMessage, faThumbsDown, faBiohazard, faFaceAngry, faEye, faRetweet, 
    faFaceSadTear, faFaceSurprise, faHeart, faComment, faSquarePlus } from '@fortawesome/free-solid-svg-icons'

type Input = {
  allowSuggestions?: boolean,
  post: PostType,
}

export const Post = ({ post, allowSuggestions }: Input) => {
  const { title, text, created_at, image_url, url, platform } = post;

  return <Row className="post">
    <Col span={16}>
      <Space direction="vertical">
        <div>
          <h1><Text text={title} allowSuggestions={allowSuggestions} /></h1>
          {created_at.$date && <h3>{new Date(created_at.$date).toLocaleDateString('en-us', { year: 'numeric', month: 'long', day: 'numeric' })}</h3>}
        </div>
        {text ? <Text text={text} allowSuggestions={allowSuggestions} /> : ''}
        <span>{platform && platformIcon(platform)} <a href={url} target="_blank">{url}</a></span>
        {
          <div className="scores">
              {post.scores?.likes ? <span><FontAwesomeIcon icon={faThumbsUp} /> {post.scores?.likes} </span>: <></>}
              {post.scores?.dislikes ? <span><FontAwesomeIcon icon={faThumbsDown} /> {post.scores?.dislikes} </span>: <></>}
              {post.scores?.views ? <span><FontAwesomeIcon icon={faEye} /> {post.scores?.views} </span>: <></>}
              {post.scores?.shares ? <span><FontAwesomeIcon icon={faRetweet} /> {post.scores?.shares} </span>: <></>}
              {post.scores?.sad ? <span><FontAwesomeIcon icon={faFaceSadTear} /> {post.scores?.sad} </span>: <></>}
              {post.scores?.wow ? <span><FontAwesomeIcon icon={faFaceSurprise} /> {post.scores?.wow} </span>: <></>}
              {post.scores?.love ? <span><FontAwesomeIcon icon={faHeart} /> {post.scores?.love} </span>: <></>}
              {post.scores?.angry ? <span><FontAwesomeIcon icon={faFaceAngry} /> {post.scores?.angry} </span>: <></>}
              {post.scores?.comments ? <span><FontAwesomeIcon icon={faComment} /> {post.scores?.comments} </span>: <></>}
              {post.scores?.other ? <span><FontAwesomeIcon icon={faSquarePlus} /> {post.scores?.other} </span>: <></>}
              
            </div>
         }
      </Space>
    </Col>
    <Col span={4} offset={4}>
      <img src={image_url}></img>
    </Col>
  </Row>
}
