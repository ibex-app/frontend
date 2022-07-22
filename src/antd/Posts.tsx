import { List, Spin } from "antd";
import * as E from "fp-ts/lib/Either";
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

const Loader = ({ isLoading }: { isLoading?: boolean }) =>
  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
    {isLoading ? 'Ibex is collecting data, please stand-by' : 'Loading'} <Spin />
  </div>

export const Posts = ({ filter, allowRedirect }: Input) => {
  const [posts, setPosts] = useState<Response<PostResponse>>(E.left(Error('Not fetched')));
  const [pagination, setPagination] = useState(defaultPagination);

  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [timeout, setTimeout_] = useState<NodeJS.Timeout>();

  const clearTimeout_ = () => {
    timeout && clearTimeout(timeout);
    setTimeout_(undefined);
  }

  const getPosts = () => Get<PostResponse>('posts', { ...filter, ...pagination });

  useEffect(() => {
    setPosts(E.left(new Error('Not fetched')));
    clearTimeout_();
    if (isFetching) return;
    setIsFetching(true);
    const try_ = () => pipe(
      then((E.fold(
        (err: Error) => setPosts(E.left(err)),
        (res: PostResponse) => match(res.is_loading && res.posts.length < 10)
          .with(true, () => {
            setIsFetching(false);
            if (!isEmpty(res)) setPosts(E.right(res));
            const timeout_: any = setTimeout(() => setTimeout_(timeout_), 5000);
            return;
          })
          .otherwise(() => {
            setIsFetching(false);
            setTimeout_(undefined);
            setPosts(E.right(res));
          })
      )))
    )(getPosts());

    try_();

    return () => clearTimeout_();
  }, [timeout]);

  useEffect(() => {
    getPosts().then(pipe(
      E.bindTo('new'),
      E.bind('old', () => posts),
      E.map((posts) => setPosts(E.right({
        is_loading: posts.new.is_loading,
        posts: posts.old.posts.concat(posts.new.posts)
      })))
    ));
  }, [pagination])

  const onLoadMore = () => {
    setPagination({ start_index: pagination.start_index + pagination.count, count: pagination.count })
  };

  useEffect(() => {
    getPosts().then(setPosts)
  }, [filter]);

  return E.fold(
    () => <Loader />,
    (data: PostResponse) =>
      <>
        <List
          dataSource={data.posts}
          style={{ paddingRight: "20px" }}
          loadMore={loadMore(onLoadMore)}
          renderItem={(item) => allowRedirect
            ? <Link to={`/details/${item._id.$oid}`}><Post post={item} /></Link>
            : <Post post={item} />
          }
        />
        {timeout && <Loader isLoading={data.is_loading} />}
      </>
  )(posts);
}  