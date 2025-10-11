import instance from '../axiosInstance';
import type {BaseResponse} from '../baseResponse';
import type {PostsDTO, FeedType} from '@/types'; // ✅ FeedType 추가

// 개별 API 함수들
export const fetchPopularPosts = async (): Promise<PostsDTO> => {
  const res = await instance.get<BaseResponse<PostsDTO>>('/api/posts/populars');
  return res.data.data;
};

export const fetchFollowPosts = async (): Promise<PostsDTO> => {
  const res = await instance.get<BaseResponse<PostsDTO>>('/api/posts/follows');
  return res.data.data;
};

export const fetchRecommendPosts = async (): Promise<PostsDTO> => {
  const res = await instance.get<BaseResponse<PostsDTO>>(
    '/api/posts/recommends',
  );
  return res.data.data;
};

type FeedId = FeedType['id']; // 'popular' | 'follow' | 'recommend'

const FEED_API_MAP: Record<FeedType['id'], () => Promise<PostsDTO>> = {
  popular: fetchPopularPosts,
  follow: fetchFollowPosts,
  recommend: fetchRecommendPosts,
} as const;

// ID 기반 통합 API 함수
export const fetchPostsByFeedId = async (feedId: FeedId): Promise<PostsDTO> => {
  const apiFunction = FEED_API_MAP[feedId];

  if (!apiFunction) {
    console.warn(`알 수 없는 피드 ID: ${feedId}, 인기 피드로 대체`);
    return fetchPopularPosts();
  }

  return apiFunction();
};
