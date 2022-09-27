import { List, Spin } from "antd";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { usePostsState } from "../state/usePostsState";
import { LoadMore } from "./LoadMore";
import { Post } from "./post/Post";

type Input = {
    filter: Filter,
    allowRedirect?: boolean,
    shuffle?: boolean
}

const defaultPagination = { start_index: 0, count: 10 };

const Loader = ({ isInProgress }: { isInProgress?: boolean }) =>
    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        {isInProgress ? 'Ibex is collecting data, please stand-by' : 'Loading'} <Spin />
    </div>

export const Posts = ({ filter, allowRedirect, shuffle }: Input) => {
    const { data, isLoading, isFetching, fetchNextPage } = usePostsState({ ...filter, ...defaultPagination, shuffle });

    const posts = useMemo(() => data?.pages.flatMap(({ posts }) => posts) || [], [data?.pages]);

    return isLoading && isFetching ? <Loader isInProgress={isLoading} /> : <>
        {!posts.length && data?.pages[0].is_loading && <Loader isInProgress={isLoading} />}
        {!!posts.length && <List
            dataSource={posts}
            style={{ paddingRight: "20px" }}
            loadMore={<LoadMore
                onLoadMore={fetchNextPage}
                count={posts.length}
                pageSize={defaultPagination.count}
                isLoading={isLoading} />
            }
            renderItem={(item) => allowRedirect
                ? <Link to={`/details/${item._id.$oid}`}><Post post={item} /></Link>
                : <Post post={item} />
            }
        />}
    </>
}  