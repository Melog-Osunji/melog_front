// @/constants/types.ts
import {mockPosts} from './dummyData';

// Post
export interface User {
  profileImg: string;
  nickName: string;
}

export interface BestComment {
  userId: string;
  content: string;
  profileImg: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userProfileImg: string;
  content: string;
  createdAgo: number;
  likeCount: number;
  commentCount?: number;
  replies?: Comment[];
}

export type Post = {
  id: string;
  userId: string;
  title: string;
  content: string;
  mediaType: string;
  mediaUrl?: string;
  createdAgo: number;
  likeCount: number;
  commentCount: number;
  tags: string[];
  bestComment?: BestComment;
  user: User;
};

// YouTube Video
export interface YouTubeVideo {
  id: string;
  title: string;
  channel: string;
  duration: string;
  thumbnail: string;
}

// Feed Type 정의
export interface FeedType {
  id: string;
  name: string;
  posts?: Post[];
}

// Search 인터페이스
export interface PopularMedia {
  userNickname: string;
  userProfileImgLink: string;
  postID: string;
  mediaURL: string;
  mediaType: string;
  createdAgo: string;
}

// 피드 타입 데이터 생성 함수
export const createFeedTypes = (contextPosts: Post[]): FeedType[] => [
  {
    id: 'recommended',
    name: '추천 피드',
    posts: [...contextPosts, ...mockPosts], // Context 포스트 + Mock 포스트
  },
  {
    id: 'popular',
    name: '인기 피드',
    posts: mockPosts.slice(1, 3), // 일부만 표시
  },
  {
    id: 'following',
    name: '내 팔로우',
    posts: mockPosts.slice(3, 4), // 다른 일부 표시
  },
];

// 기본 피드 타입 (호환성을 위해 유지)
export const feedTypes: FeedType[] = createFeedTypes([]);
