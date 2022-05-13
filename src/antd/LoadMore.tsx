import { Button } from "antd";

export const loadMore = (onLoadMore: any) => <div
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