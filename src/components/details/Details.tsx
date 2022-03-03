
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { get, PromiseResponse } from '../../shared/Http';
import { PostDetail } from '../../types/detail';
import * as E from "fp-ts/lib/Either";

export function Details() {
  const [data, setData] = useState<PostDetail | null>(null);
  const { postId } = useParams();

  useEffect(() => {
    const fetchData: PromiseResponse<PostDetail> = get('post', {
      id: postId
    });

    fetchData.then(_data => E.map(setData)(_data));
  }, []);

  return (
    <div className="container-fluid">
      {data ? (
        <div className="row">
          <div className="col-6">
            <section className="post--content">
              {data.image_url ? <img src={data.image_url}></img> : <span>Image not found!</span>}
            </section>
            <section className="post--content-extra">
              <div className="post--status flex">
                <div className="flex">
                  {/* JANEZ CONTROL
                    რამდენად სწორად დავამთხვიე არ ვიცი, გადახედე, რაღაცები სახელებით არ ემთხვევა
                   */}
                  <div className="col"><i className="icn icn--like"></i><span>{data.scores.likes}</span></div>
                  <div className="col"><i className="icn icn--dislike"></i><span>{data.scores.angry}</span></div>
                  <div className="col"><i className="icn icn--share"></i><span>{data.scores.shares}</span></div>
                  <div className="col"><i className="icn icn--comment"></i><span>{data.scores.engagement}</span></div>
                  <div className="col"><i className="icn icn--toxicity"></i><span>{data.hate_speech}</span></div>
                </div>
                <div className="post--date ml-a"><span>{data.created_at}</span></div>
              </div>
              {/* JANEZ CONTROL 
               ტეგები არაა დატაში */}
              <div className="post--tags flex">
                <div className="flex"><span className="font-xs mr-15">Tags</span>
                  <div className="flex"><span className="badge bg-secondary">tag 1</span><span className="badge bg-secondary">tag 2</span><span className="badge bg-secondary">tag 3</span></div>
                </div>
              </div>
              <div className="post--details">
                <div className="flex">
                  <div className="channgel-logo">
                    {/* IMG */}
                  </div>
                  <span>{data.platform}</span>
                </div>
                <p>{data.text}</p>
              </div>
            </section>
          </div>
          {data.transcripts && <div className="col-6">
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
          </div>}

        </div>
      ) : (<div>Loading...</div>)}
    </div>
  );
}