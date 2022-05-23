import { List } from "antd";
import { fold, left } from "fp-ts/lib/Either";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Get, Response } from "../shared/Http";
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
  const [filters, setFilters] = useState<Filter>();

  const onLoadMore = () => setPagination({ start_index: pagination.count, count: 2 * pagination.count });

  useEffect(() => {
    if (pagination) Get<PostType[]>('posts', { ...filter, ...pagination }).then(setPosts);
  }, [pagination]);

  useEffect(() => {
    if (JSON.stringify(filters) !== JSON.stringify(filter)) {
      setFilters(filter);
      Get<PostType[]>('posts', { ...filter, ...pagination }).then(setPosts);
      setPagination(defaultPagination);
    }
  }, [filter]);

  return fold(
    () => <span>No posts to show</span>,
    (posts: PostType[]) =>
      <List dataSource={posts} style={{ paddingRight: "20px" }}
        loadMore={loadMore(onLoadMore)}
        renderItem={(item) => allowRedirect
          ? <Link to={`details/${item._id.$oid}`}><Post post={item} /></Link>
          : <Post post={item} />
        }
      />
  )(posts);
}  