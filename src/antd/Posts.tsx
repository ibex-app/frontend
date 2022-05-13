import { List } from "antd";
import { fold, left } from "fp-ts/lib/Either";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Get, Response } from "../shared/Http";
import { PostType } from "../types/common";
import { loadMore } from "./LoadMore";
import { Post } from "./post/Post";

type Input = {
  filter: Filter
}

export const Posts = ({ filter }: Input) => {
  const [posts, setPosts] = useState<Response<PostType[]>>(left(Error('Not fetched')));
  const [pagination, setPagination] = useState({ start_index: 0, count: 10 });

  const onLoadMore = () => setPagination({ start_index: pagination.count, count: 2 * pagination.count });

  useEffect(() => {
    Get<PostType[]>('posts', { ...filter, ...pagination }).then(setPosts);
  }, [filter, pagination]);

  return fold(
    () => <span>No posts to show</span>,
    (posts: PostType[]) =>
      <List dataSource={posts} style={{ paddingRight: "20px" }}
        loadMore={loadMore(onLoadMore)}
        renderItem={(item) => <Post post={item} />}
      />
  )(posts);
}  