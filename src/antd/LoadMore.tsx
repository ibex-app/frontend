import { Button } from "antd";
import { useEffect, useRef } from "react";
import { useOnScreen } from "../shared/Utils";
import { Loader } from './Loader';

type Input = {
  onLoadMore: () => void,
  count: number,
  pageSize: number,
  isLoading: boolean
}

export const LoadMore = ({ onLoadMore, count, pageSize, isLoading }: Input) => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(ref);

  useEffect(() => {
    isVisible && onLoadMore()
  }, [isVisible, onLoadMore]);

  return count < pageSize
    ? isLoading ? <Loader isInProgress={isLoading} /> : <></>
    : <div
      ref={ref}
      style={{
        textAlign: 'center',
        marginTop: 12,
        height: 32,
        lineHeight: '32px',
        marginBottom: '20px'
      }}
    >
      <Button onClick={onLoadMore}>Load More...</Button>
    </div>
}
