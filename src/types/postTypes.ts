// 포스트 관련 모든 타입 정의
import {FEED_IDS} from '@/constants';

//post
export type PostDTO = {
  id: string;
  title: string;
  content: string;
  mediaType: string;
  mediaUrl: string;
  tags: string[];
  createdAgo: number;
  likeCount: number;
  hiddenUser: string[];
  commentCount: number;
  bestComment?: BestCommentDTO;
};

export type PostWithUserDTO = {
  post: PostDTO;
  user: UserDTO;
};

export type PostsDTO = {
  results: PostWithUserDTO[];
};

//user
export type UserDTO = {
  id: string;
  nickName: string;
  profileImg: string;
};

//comment
export interface CommentDTO {
  userID: string;
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
export interface FeedType {
  id: string;
  label: string;
  posts?: PostWithUserDTO[];
}

export type FeedId = (typeof FEED_IDS)[keyof typeof FEED_IDS]; // 'popular' | 'follow' | 'recommend'
