import { TypeOrNull } from "./common";

export interface PostDetail {
  api_dump: Object,
  author_platform_id: TypeOrNull<string>,
  created_at: TypeOrNull<string>,
  data_source_id: TypeOrNull<string>,
  has_video: TypeOrNull<boolean>,
  hate_speech: TypeOrNull<boolean>,
  image_url: TypeOrNull<string>,
  labels: TypeOrNull<Array<string>>,
  media_download_status: TypeOrNull<any>
  monitor_ids: []
  platform: string,
  platform_id: string,
  scores: {
    likes: number,
    views: TypeOrNull<number>,
    engagement: number,
    shares: number,
    sad: number,
    wow: number,
    love: number,
    angry: number
  },
  sentiment: null,
  text: string,
  title: string,
  transcripts: TypeOrNull<[]>
  url: string,
  _id: string
}