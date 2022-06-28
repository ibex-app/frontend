import { List } from "antd";
import { fold, left, right } from "fp-ts/lib/Either";
import { isEmpty, pipe } from "ramda";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { match } from "ts-pattern";
import { Get, Response } from "../shared/Http";
import { then } from "../shared/Utils";
import { PostType } from "../types/common";
import { loadMore } from "./LoadMore";
import { Post } from "./post/Post";

type Input = {
  filter: Filter,
  allowRedirect?: boolean
}

const defaultPagination = { start_index: 0, count: 10 };

export const Posts = ({ filter, allowRedirect }: Input) => {
  const [posts, setPosts] = useState<Response<PostType[]>>(left(Error('Not fetched')));
  const [pagination, setPagination] = useState(defaultPagination);
  const [filters, setFilters] = useState<Filter>(filter);
  const [timeout, setTimeout_] = useState<NodeJS.Timeout>();

  useEffect(() => {
    timeout && clearTimeout(timeout) && setTimeout_(undefined);
    const try_ = () => pipe(
      then((fold(
        (err: Error) => setPosts(left(err)),
        (res: PostType[]) => match(isEmpty(res) || res.length < 10)
          .with(true, () => {
            if(!isEmpty(res)) setPosts(right(res))  
            const timeout_: any = setTimeout(() => setTimeout_(timeout_), 5000);
            return;
          })
          .otherwise(() => setPosts(right(res)))
      )))
    )(Get<PostType[]>('posts', { ...filter, ...pagination }));

    try_();

    return () => timeout && clearTimeout(timeout) && setTimeout_(undefined);
  }, [filters, pagination, timeout]);

  const onLoadMore = () => setPagination({ start_index: pagination.count, count: 2 * pagination.count });

  useEffect(() => {
    if (JSON.stringify(filters) !== JSON.stringify(filter)) setFilters(filter);
  }, [filter]);

  // useEffect(() => { dataRes.then((res) => res && setPosts(res)) }, [dataRes]);
  // useEffect(() => { setProps({ ...filter, ...pagination }) }, [filter, pagination]);

  return fold(
    () => <span>No posts to show</span>,
    (posts: PostType[]) =>
      <List 
        dataSource={posts} 
        style={{ paddingRight: "20px" }}
        loadMore={loadMore(onLoadMore)}
        renderItem={(item) => allowRedirect
          ? <Link to={`details/${item._id.$oid}`}><Post post={item} /></Link>
          : <Post post={item} />
        }
      />
  )(posts);
}  