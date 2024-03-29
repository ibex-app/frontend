import { useInfiniteQuery } from "react-query"
import { _Get } from "../shared/Http"
import { queries } from "../shared/Queries"
import { PostResponse } from "../types/common"

interface InputParams extends Filter, Pagination {
  shuffle?: boolean
}

export const usePostsState = (params: InputParams) =>
  useInfiniteQuery(queries.posts(params), ({ pageParam = 0 }) => _Get<PostResponse>('posts', { ...params, start_index: pageParam * 30 }), {
    enabled: !!params.monitor_id,
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage, pages) => pages.length || 1
  })