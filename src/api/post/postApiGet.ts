import instance from '../axiosInstance';
import type {BaseResponse} from '../baseResponse';
import type {PostsDTO, CommentsDTO, FeedId, PostWithUserDTO} from '@/types';
import {FEED_IDS} from '@/constants';

// #1) feed posts (GET requests)
// GET /api/posts/populars (인기 피드)
export const fetchPopularPosts = async (): Promise<PostsDTO> => {
  const res = await instance.get<BaseResponse<PostsDTO>>('/api/posts/populars');
  return res.data.data;
};

// GET /api/posts/follows (내 팔로우 피드)
export const fetchFollowPosts = async (): Promise<PostsDTO> => {
  const res = await instance.get<BaseResponse<PostsDTO>>('/api/posts/follows');
  return res.data.data;
};

// GET /api/posts/recommends (추천 피드)
export const fetchRecommendPosts = async (): Promise<PostsDTO> => {
  const res = await instance.get('/api/posts/recommends');

  // (임시 err 처리) 서버가 BaseResponse<T>를 따르지 않고 { results: [...] } 형태로 반환하는 경우를 처리
  const payload = (res.data as any)?.data ?? res.data;

  if (!payload) {
    console.warn(
      '[postApiGet.ts] /api/posts/recommends payload 비어있음 → 빈 결과 반환',
    );
    return {results: []} as PostsDTO;
  }

  return payload as PostsDTO;
};

// 피드 아이디에 따른 API 함수 맵핑
const FEED_API_MAP: Record<FeedId, () => Promise<PostsDTO>> = {
  [FEED_IDS.POPULAR]: fetchPopularPosts,
  [FEED_IDS.FOLLOW]: fetchFollowPosts,
  [FEED_IDS.RECOMMEND]: fetchRecommendPosts,
} as const;

export const fetchPostsByFeedId = async (feedId: FeedId): Promise<PostsDTO> => {
  const apiFunction = FEED_API_MAP[feedId];

  //err : 알 수 없는 피드 아이디 -> 인기 피드로 대체
  if (!apiFunction) {
    return fetchPopularPosts();
  }

  return apiFunction();
};

//#2) post detail (GET requests)
// GET /api/posts/{postId} (게시글 상세)
export const fetchPostDetail = async (
  postId: string,
): Promise<PostWithUserDTO> => {
  const res = await instance.get<BaseResponse<PostWithUserDTO>>(
    `/api/posts/${postId}`,
  );
  return res.data.data;
};

// GET /api/posts/{postId}/comments (게시글 댓글 목록)
export const fetchPostComments = async (
  postId: string,
): Promise<CommentsDTO> => {
  const res = await instance.get<BaseResponse<CommentsDTO>>(
    `/api/posts/${postId}/comments`,
  );
  return res.data.data;
};

// 2) bookmark (NOTE: this endpoint uses GET)
// GET /api/posts/{postId}/bookmarks (게시글 북마크)
export const fetchPostBookmarks = async (postId: string) => {
  const res = await instance.get<BaseResponse<any>>(
    `/api/posts/${postId}/bookmarks`,
  );
  return res.data.data;
};
