import instance from '../axiosInstance';
import type {BaseResponse} from '../baseResponse';
import type {PostsDTO} from '@/types';

// 인기 피드
export const fetchPopularPosts = async (): Promise<PostsDTO> => {
  const res = await instance.get<BaseResponse<PostsDTO>>('/api/posts/populars');
  return res.data.data;
};

// 팔로우 피드
export const fetchFollowPosts = async (): Promise<PostsDTO> => {
  const res = await instance.get<BaseResponse<PostsDTO>>('/api/posts/follows');
  return res.data.data;
};

// 추천 피드
export const fetchRecommendPosts = async (): Promise<PostsDTO> => {
  const res = await instance.get<BaseResponse<PostsDTO>>(
    '/api/posts/recommends',
  );
  return res.data.data;
};

// 피드 타입에 따른 API 함수 매핑
export const FEED_API_MAP = {
  인기: fetchPopularPosts,
  팔로우: fetchFollowPosts,
  추천: fetchRecommendPosts,
} as const;

// 통합 피드 조회 함수
export const fetchPostsByFeedType = async (
  feedType: string,
): Promise<PostsDTO> => {
  const apiFunction = FEED_API_MAP[feedType as keyof typeof FEED_API_MAP];

  if (!apiFunction) {
    console.warn(`⚠️ 알 수 없는 피드 타입: ${feedType}, 인기 피드로 대체`);
    return fetchPopularPosts();
  }

  return apiFunction();
};
