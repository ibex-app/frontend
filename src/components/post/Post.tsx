import { PostType } from "../../types/common";

export const Post = ({ post }: { post: PostType }) => {

  return <div>{post.title}</div>
}