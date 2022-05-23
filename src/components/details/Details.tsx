
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Get } from '../../shared/Http';
import * as E from "fp-ts/lib/Either";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons"
import { match } from 'ts-pattern';
import { faThumbsUp, faShare, faMessage, faThumbsDown, faBiohazard } from '@fortawesome/free-solid-svg-icons'
import './details.css';
import { Col, Row } from "antd";

export function Details() {
  const { postId } = useParams();
  const [post, setPost]: any = useState([]);
  const [fetching, setFetching]: any = useState(true);
  const [options, setOptions]: any = useState({
    autoplay: 0,
    second: 0
  });

  const toTime = (second: number) => {
    let min = Math.floor(second / 60)
    let sec = Math.floor(second - (min * 60))
    let hour_str = ''

    if (min > 60) {
      let hour = Math.floor(min / 60)
      min = Math.floor(min - (hour * 60))
      hour_str = hour + ':'
    }

    return hour_str + (min < 10 ? '0' : '') + min + ':' + (sec < 10 ? '0' : '') + sec
  }
  const rewind = (second: number) => {
    setOptions({ autoplay: 1, second: Math.floor(second) });
  };

  const postItem = <>
    <section className="post--content">
      <iframe id="ytplayer" src={`${post?.url?.replace("/watch?v=", "/embed/")}?start=${options.second}&autoplay=${options.autoplay}`} ></iframe>
    </section>
    <section className="post--content-extra">
      <div className="table--item">
        <div className="table--row">
          <div >
            <div className="title"> {post.title}</div>
            {<div className="sub-title"> {post.created_at} | chanell name </div>}
            <div className="description"> {post.text} </div>
            {<Link className="platform" to={post.url}> {post.platform} {post.url}</Link>}
            {<div className="scores">
              <FontAwesomeIcon icon={faThumbsUp} /> {post.scores?.likes}
              <FontAwesomeIcon icon={faThumbsDown} /> {post.scores?.sad}
              <FontAwesomeIcon icon={faShare} /> {post.scores?.shares}
              <FontAwesomeIcon icon={faMessage} /> {post.scores?.engagement}
              <FontAwesomeIcon icon={faBiohazard} />
            </div>
            }

          </div>
          {/* <Tag data={tags} onChange={() => console.log("TODO JANEZ")} /> */}

          <div className="table--extra-row"><i className="icn icn--type-video"></i>
            <div className="table--item-tags">
              <div className="flex">
                {/* <span className="font-xs mr-15">Tags</span> */}
                <div className="flex">
                  {/* {tags.map(({ title }: any) => (<a href="£" className="badge bg-secondary">{title}</a>))} */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </>

  const transcripts =
    <section className="transcripts">
      {post.transcripts ? post.transcripts.map((transcript: any) => (

        // <div>aaaa</div>
        <div className="table--item" onClick={() => rewind(transcript.second)}>
          <p> <span className="time">{toTime(transcript.second)}</span> {transcript.text}</p>
        </div>
      )) : <div />}

    </section>

  useEffect(() => {
    const fetchData = Get('post', {
      id: postId
    });

    fetchData.then((_post: any) => {
      let maybePost: any = E.getOrElse(() => [])(_post)
      if (!maybePost) return;

      maybePost.created_at = new Date(maybePost.created_at.$date).toLocaleString('en-us', { month: 'short', year: 'numeric', day: 'numeric' })
      maybePost.platform = match(maybePost.platform)
        .with("facebook", () => <FontAwesomeIcon icon={faFacebook} />)
        .with("twitter", () => <FontAwesomeIcon icon={faTwitter} />)
        .with("youtube", () => <FontAwesomeIcon icon={faYoutube} />)
        .otherwise(() => <span>Invalid Icon</span>)

      maybePost.tags = maybePost.labels ? [].concat(
        maybePost.labels.topics || [],
        maybePost.labels.persons || [],
        maybePost.labels.locations || [],
        maybePost.labels.organizations || []
      ) : [];
      setPost(maybePost)
      setFetching(false)
    });
  }, []);
  return (
    <div className="container-fluid details">
      {
        fetching ? (
          <div className="button-tr"><div><div className="round-btn-transp">Loading...</div></div></div>
        ) : (
          <Row>
            {post.transcripts
              ? <>
                <Col span={12}>{postItem}</Col> <Col span={12}>{transcripts}</Col>
              </>
              : <Col span={24}>{postItem}</Col>
            }
          </Row>
        )}
    </div>
  )
}