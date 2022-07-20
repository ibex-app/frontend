import { List, Spin } from "antd";
import { fold, left, right } from "fp-ts/lib/Either";
import { isEmpty, pipe } from "ramda";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { match } from "ts-pattern";
import { Get, Response } from "../shared/Http";
import { then } from "../shared/Utils";
import { PostResponse, PostType } from "../types/common";
import { loadMore } from "./LoadMore";
import { Post } from "./post/Post";

type Input = {
  filter: Filter,
  allowRedirect?: boolean
}

const defaultPagination = { start_index: 0, count: 10 };

const Loader = () => <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
  Ibex is collecting data, please stand-by <Spin />
</div>

export const Posts = ({ filter, allowRedirect }: Input) => {
  const [posts, setPosts] = useState<Response<PostResponse>>(left(Error('Not fetched')));
  const [pagination, setPagination] = useState(defaultPagination);
  const [filters, setFilters] = useState<Filter>(filter);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [uppend, setUppend] = useState<boolean>(false);
  const [timeout, setTimeout_] = useState<NodeJS.Timeout>();

  const clearTimeout_ = () => {
    timeout && clearTimeout(timeout);
    setTimeout_(undefined);
  }

  useEffect(() => {
    setPosts(left(new Error('Not fetched')));
    clearTimeout_();
    if (isFetching) return;
    setIsFetching(true);
    const try_ = () => pipe(
      then((fold(
        (err: Error) => setPosts(left(err)),
        (res: PostResponse) => match(res.is_loading && res.posts.length < 10)
          .with(true, () => {
            setIsFetching(false);
            if (!isEmpty(res)) setPosts(right(res));
            const timeout_: any = setTimeout(() => setTimeout_(timeout_), 5000);
            return;
          })
          .otherwise(() => {
            setIsFetching(false);
            setTimeout_(undefined);
            
            // const finalRes: Response<PostResponse> = right(res)
            // finalRes.posts = finalRes.posts.concat(posts.posts);
            // setPosts(finalRes);
            setPosts(right(res));
          })
      )))
    )(Get<PostResponse>('posts', { ...filter, ...pagination }));

    try_();

    return () => clearTimeout_();
  }, [timeout, filters, pagination]);

  const onLoadMore = () => {
    setUppend(true);
    setPagination({ start_index: pagination.start_index + pagination.count, count: pagination.count })
  };

  useEffect(() => {
    setUppend(false);
    if (JSON.stringify(filters) !== JSON.stringify(filter)) setFilters(filter);
  }, [filter]);

  // useEffect(() => { dataRes.then((res) => res && setPosts(res)) }, [dataRes]);
  // useEffect(() => { setProps({ ...filter, ...pagination }) }, [filter, pagination]);

  return fold(
    () => <Loader />,
    (data: PostResponse) =>
      <>
        <List
          dataSource={data.posts}
          style={{ paddingRight: "20px" }}
          loadMore={!timeout && loadMore(onLoadMore)}
          renderItem={(item) => allowRedirect
            ? <Link to={`/details/${item._id.$oid}`}><Post post={item} /></Link>
            : <Post post={item} />
          }
        />
        {timeout && <Loader />}
      </>
  )(posts);
}  