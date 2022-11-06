export type TypeOrNull<T> = T | null;

export type PostResponse = {
  is_loading: boolean;
  posts: PostType[];
}

export type PostType = {
  "_id": {
    "$oid": string
  },
  "title": string,
  "text": string,
  "created_at": {
    "$date": number
  },
  "platform": string,
  "platform_id": string,
  "account_id": null,
  "author_platform_id": string,
  "hate_speech": null,
  "sentiment": null,
  "has_video": null,
  "api_dump": "",
  "url": string,
  "media_status": string,
  "monitor_ids": [
    {
      "$uuid": string
    }
  ],
  "image_url": string,
  "labels": {
    "topics": [],
    "locations": [],
    "persons": []
  },
  "scores": {
    "likes": number,
    "dislikes": number,
    "views": number,
    "engagement": number,
    "shares": number,
    "sad": number,
    "wow": number,
    "love": number,
    "angry": number,
    "comments": number,
    "other" : number
  },
  "transcripts": null,
  "account": []
}