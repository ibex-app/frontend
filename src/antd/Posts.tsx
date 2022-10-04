import { List } from "antd";
import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { usePostsState } from "../state/usePostsState";
import { LoadMore } from "./LoadMore";
import { Post } from "./post/Post";
import { Loader } from "./Loader";

type Input = {
    filter: Filter,
    allowRedirect?: boolean,
    shuffle?: boolean
}

const defaultPagination = { start_index: 0, count: 10 };

export const Posts = ({ filter, allowRedirect, shuffle }: Input) => {
    const { data, isLoading, isFetching, fetchNextPage, refetch } = usePostsState({ ...filter, ...defaultPagination, shuffle });
    const lastPostsData = useMemo(() => data?.pages[data?.pages.length - 1], [data]);
    const isLoadingFromServ = useMemo(() => data?.pages[data.pages.length - 1].is_loading, [data]);

    const posts = useMemo(() => data?.pages.flatMap(({ posts }) => posts) || [], [data?.pages]);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (lastPostsData?.is_loading && lastPostsData.posts.length < defaultPagination.count) {
            interval = setInterval(() => refetch({
                refetchPage: (page, index) => index === ((data?.pages?.length || 1) - 1)
            }), 5000)
        }

        return () => clearInterval(interval);
    }, [lastPostsData, refetch, data?.pages?.length]);

    return isLoading && isFetching ? <Loader isInProgress={isLoadingFromServ} /> : <>
        {!posts.length && isLoadingFromServ && <Loader isInProgress={isLoadingFromServ} />}
        {!!posts.length && <List
            dataSource={posts}
            style={{ paddingRight: "20px" }}
            loadMore={<LoadMore
                onLoadMore={fetchNextPage}
                count={lastPostsData?.posts?.length || 0}
                pageSize={defaultPagination.count}
                isLoading={isLoadingFromServ || false} />
            }
            renderItem={(item) => allowRedirect
                ? <Link to={`/details/${item._id.$oid}`}><Post post={item} /></Link>
                : <Post post={item} />
            }
        />}
    </>
}  