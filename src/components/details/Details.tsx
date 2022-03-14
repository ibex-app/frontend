
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { get, PromiseResponse } from '../../shared/Http';
import { PostDetail } from '../../types/detail';
import * as E from "fp-ts/lib/Either";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons"
// import { } from "@fortawesome/free-brands-svg-icons"
import { match } from 'ts-pattern';
import { faThumbsUp, faShare, faMessage, faThumbsDown, faBiohazard } from '@fortawesome/free-solid-svg-icons'

export function Details() {
  const [data, setData] = useState<PostDetail | null>(null);
  const { postId } = useParams();
  const [post, setPost]: any = useState([]);
  const [fetching, setFetching]: any = useState(false);

  useEffect(() => {
    setFetching(true)
    const fetchData = get('post', {
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

      console.log(maybePost)
      setPost(maybePost)
      setFetching(false)
    });
  }, []);
  return (
    <div className="container-fluid">
      {
        fetching ? (
          <div className="button-tr"><div><div className="round-btn-transp">Loading...</div></div></div>
        ) : (
          <div className="row">
            <div className="col-6">
              <section className="post--content">
                <video src={post.url}></video>
              </section>
              <section className="post--content-extra">
                <div className="table--item">
                  <div className="table--row">
                    <div >
                      <div className="title"> {post.title}
                      </div>
                      {<div className="sub-title"> {post.created_at} | chanell name </div>}
                      {<div className="platform"> <a target="_blank" href={post.url}> {post.platform} {post.url}</a> </div>}
                      {<div className="scores">
                        <FontAwesomeIcon icon={faThumbsUp} /> {post.scores?.likes}
                        <FontAwesomeIcon icon={faThumbsDown} /> {post.scores?.sad}
                        <FontAwesomeIcon icon={faShare} /> {post.scores?.shares}
                        <FontAwesomeIcon icon={faMessage} /> {post.scores?.engagement}
                        <FontAwesomeIcon icon={faBiohazard} />
                      </div>
                      }

                    </div>
                    {
                      post.image_url ? (<img src={post.image_url} />) : (<div> </div>)
                    }

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
            </div>
            <div className="col-6">
              <section className="transcripts">
                <div className="transcripts--item">
                  <p>ავღანეთის ქალაქ ასადაბადში გამართულ </p>
                  <div className="flex"><span className="badge bg-secondary">tag 1</span><span className="badge bg-secondary">tag 2</span><span className="badge bg-secondary">tag 3</span></div>
                </div>
                <div className="transcripts--item">
                  <p>ავღანეთის ქალაქ ასადაბადში გამართულ </p>
                  <div className="flex"><span className="badge bg-secondary">tag 1</span><span className="badge bg-secondary">tag 2</span><span className="badge bg-secondary">tag 3</span></div>
                </div>
                <div className="transcripts--item">
                  <p>ავღანეთის ქალაქ ასადაბადში გამართულ </p>
                  <div className="flex"><span className="badge bg-secondary">tag 1</span><span className="badge bg-secondary">tag 2</span><span className="badge bg-secondary">tag 3</span></div>
                </div>
              </section>
            </div>
          </div>
        )}
    </div>
  )
}