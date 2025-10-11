import {useQuery, UseQueryResult} from '@tanstack/react-query';
import {
  fetchPopularPosts,
  fetchFollowPosts,
  fetchRecommendPosts,
  fetchPostsByFeedType,
} from '@/api/post/postApi';
import {PostsDTO} from '@/types';

// 쿼리 키 상수
export const POST_QUERY_KEYS = {
  posts: ['posts'] as const,
  popular: () => [...POST_QUERY_KEYS.posts, 'popular'] as const,
  follows: () => [...POST_QUERY_KEYS.posts, 'follows'] as const,
  recommends: () => [...POST_QUERY_KEYS.posts, 'recommends'] as const,
  byFeedType: (feedType: string) =>
    [...POST_QUERY_KEYS.posts, 'feedType', feedType] as const,
} as const;

// 개별 피드 훅들
export const usePopularPosts = (): UseQueryResult<PostsDTO, Error> => {
  console.log('Fetching popular posts...');
  return useQuery({
    queryKey: POST_QUERY_KEYS.popular(),
    queryFn: fetchPopularPosts,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });
};

export const useFollowPosts = (): UseQueryResult<PostsDTO, Error> => {
  return useQuery({
    queryKey: POST_QUERY_KEYS.follows(),
    queryFn: fetchFollowPosts,
    staleTime: 3 * 60 * 1000, // 3분
    gcTime: 5 * 60 * 1000, // 5분
  });
};

export const useRecommendPosts = (): UseQueryResult<PostsDTO, Error> => {
  return useQuery({
    queryKey: POST_QUERY_KEYS.recommends(),
    queryFn: fetchRecommendPosts,
    staleTime: 3 * 60 * 1000, // 3분
    gcTime: 5 * 60 * 1000, // 5분
  });
};

// 피드 타입에 따른 통합 훅
export const usePostsByFeedType = (
  feedType: string,
): UseQueryResult<PostsDTO, Error> => {
  return useQuery({
    queryKey: POST_QUERY_KEYS.byFeedType(feedType),
    queryFn: () => fetchPostsByFeedType(feedType),
    enabled: !!feedType, // feedType이 있을 때만 실행
    staleTime: 3 * 60 * 1000, // 3분
    gcTime: 5 * 60 * 1000, // 5분
  });
};
