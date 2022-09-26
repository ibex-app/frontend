import { List, Spin } from "antd";
import * as E from "fp-ts/lib/Either";
import { any, isEmpty, pipe } from "ramda";
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
    allowRedirect?: boolean,
    shuffle?: boolean
}

const defaultPagination = { start_index: 0, count: 10 };

const Loader = ({ isInProgress }: { isInProgress?: boolean }) =>
    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        {isInProgress ? 'Ibex is collecting data, please stand-by' : 'Loading'} <Spin />
    </div>

export const Posts = ({ filter, allowRedirect, shuffle }: Input) => {
    const [posts, setPosts] = useState<Response<PostResponse>>(E.left(Error('Not fetched')));
    const [pagination, setPagination] = useState(defaultPagination);

    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [isInProgress, setIsInProgress] = useState<boolean>(false);
    const [filterRef, setFilterRef] = useState<any>({});
    const [timeout, setTimeout_] = useState<NodeJS.Timeout>();


    const clearTimeout_ = () => {
        timeout && clearTimeout(timeout);
        setTimeout_(undefined);
    }

    const getPosts = () => {
        // console.log(2222, 'getPosts called')
        return Get<PostResponse>('posts', { ...filter, ...pagination, ...{ shuffle: Boolean(shuffle) } })
    };

    const try_ = () => {
        // console.log(222, 'try_')
        pipe(
            then((E.fold(
                (err: Error) => setPosts(E.left(err)),
                (res: PostResponse) => match(res.is_loading && res.posts.length < 10)
                    .with(true, () => {
                        setIsFetching(false);
                        if (!isEmpty(res)) {

                            E.fold(() => console.log(1111, ''),
                                (newPosts: PostResponse) => {
                                    if (newPosts.is_loading) setIsInProgress(true)
                                    E.fold(() => console.log(1111, ''),
                                        (posts: PostResponse) => {
                                            if (posts.posts.length !== newPosts.posts.length) setPosts(E.right(res));
                                        })(posts)
                                })(E.right(res))

                        }

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
    }

    useEffect(() => {
        // setPosts(E.left(new Error('Not fetched')));
        clearTimeout_();
        if (isFetching) return;
        setIsFetching(true);
        try_();
        return () => clearTimeout_();
    }, [timeout]);

    useEffect(() => {
        if (pagination.start_index == 0) return;
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
        // console.log(222, JSON.stringify(filter), JSON.stringify(filterRef))
        if (JSON.stringify(filter) === JSON.stringify(filterRef)) return
        setFilterRef(filter)
        clearTimeout_()
        getPosts().then(setPosts)
    }, [filter]);

    return E.fold(
        () => <Loader isInProgress={isInProgress} />,
        (data: PostResponse) =>
            <>
                {!data?.posts?.length && data.is_loading && <Loader isInProgress={isInProgress} />}
                {!!data?.posts?.length && <List
                    dataSource={data.posts}
                    style={{ paddingRight: "20px" }}
                    loadMore={loadMore(onLoadMore, data.posts.length, pagination.count, data.is_loading)}
                    renderItem={(item) => allowRedirect
                        ? <Link to={`/details/${item._id.$oid}`}><Post post={item} /></Link>
                        : <Post post={item} />
                    }
                />}
            </>
    )(posts);
}  