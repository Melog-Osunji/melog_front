// src/types/postTypes.ts
//post
export type PostDTO = {
  id: string;
  title: string;
  content: string;
  mediaType: string;
  mediaUrl: string;
  tags: string[];
  createdAgo?: number;
  likeCount: number;
  hiddenUser?: string[];
  commentCount: number;
  bestComment?: BestCommentDTO;
  isLike?: boolean;
  isBookmark?: boolean;
};

export type PostWithUserDTO = {
  post: PostDTO;
  user: UserDTO;
};

export type PostsDTO = {
  results: PostWithUserDTO[];
};

export type NewPostDTO = Pick<
  PostDTO,
  'title' | 'content' | 'mediaType' | 'mediaUrl' | 'tags'
>;

//user
export type UserDTO = {
  id: string;
  nickName: string;
  profileImg: string;
};

//comment
export interface CommentDTO {
  id: string;
  userID: string;
  nickname?: string;
  profileUrl: string;
  content: string;
  likes: number;
  recomments?: CommentDTO[];
}

export type CommentsDTO = {
  comments: CommentDTO[];
};

export type BestCommentDTO = Pick<CommentDTO, 'userID' | 'content'>;

// feed
export type FeedId = 'popular' | 'follow' | 'recommend';

export interface FeedType {
  id: FeedId;
  label: string;
  posts?: PostWithUserDTO[];
  icon?: any;
}
