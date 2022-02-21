
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { get } from '../../shared/Http';

export function Details() {
  const { postId } = useParams();

  useEffect(() => {
    const fetchData = get('post', {
      id: postId
    });
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-6">
          <section className="post--content">
            <video src=""></video>
          </section>
          <section className="post--content-extra">
            <div className="post--status flex">
              <div className="flex">
                <div className="col"><i className="icn icn--like"></i><span>2000</span></div>
                <div className="col"><i className="icn icn--dislike"></i><span>500</span></div>
                <div className="col"><i className="icn icn--share"></i><span>256</span></div>
                <div className="col"><i className="icn icn--comment"></i><span>3755</span></div>
                <div className="col"><i className="icn icn--toxicity"></i><span>95</span></div>
              </div>
              <div className="post--date ml-a"><span>02/02/2022</span></div>
            </div>
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
                <span>რადიო თავისუფლება</span>
              </div>
              <p>"საჭიროა ისიც გავარკვიოთ, რა სარგებლობას აძლევს რუსეთს აფხაზეთის დამოუკიდებლობის აღიარება" - სტატია, რომელიც აუცილებლად უნდა წაიკითხოთ! 👇</p>
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
    </div>
  );
}