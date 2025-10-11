// 포스트 관련 모든 타입 정의
import {FEED_IDS} from '@/constants';

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
  bestComment?: Comment;
};

export type UserDTO = {
  id: string;
  nickName: string;
  profileImg: string;
};

export type PostWithUserDTO = {
  post: PostDTO;
  user: UserDTO;
};

export type PostsDTO = {
  results: PostWithUserDTO[];
};

export type Comment = {
  userId: string;
  content: string;
  profileImg: string; // 이후 추가 요청
};

// 타입 정의
export interface FeedType {
  id: string;
  label: string;
  posts?: PostWithUserDTO[];
}

// 타입 유니온 추출
export type FeedId = (typeof FEED_IDS)[keyof typeof FEED_IDS]; // 'popular' | 'follow' | 'recommend'
