import { useState } from "react"
import { useInfiniteQuery } from "react-query"
import { _Get } from "../shared/Http"
import { queries } from "../shared/Queries"
import { PostResponse } from "../types/common"

interface InputParams extends Filter, Pagination {
  shuffle?: boolean
}

export const usePostsState = (params: InputParams) => {
  const [refetchInterval, setRefetchInterval] = useState(5000);

  return useInfiniteQuery(queries.posts(params), ({ pageParam = 0 }) => _Get<PostResponse>('posts', { ...params, start_index: pageParam }), {
    enabled: !!params.monitor_id,
    refetchInterval: refetchInterval,
    refetchOnWindowFocus: false,
    // getNextPageParam: () => params.start_index + 1,
    getNextPageParam: (lastPage, pages) => pages.length - 1,
    onSuccess: ({ pages }) => {
      const { is_loading, posts } = pages[pages.length - 1];
      !(is_loading && posts.length < 10) && setRefetchInterval(0);
    }
  })
}