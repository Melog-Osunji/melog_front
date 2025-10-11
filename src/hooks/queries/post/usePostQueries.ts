import {useQuery} from '@tanstack/react-query';
import {fetchPostsByFeedId} from '@/api/post/postApi';
import {PostsDTO} from '@/types';
import {UseQueryCustomOptions} from '@/types';

// 쿼리 키 상수
export const POST_QUERY_KEYS = {
  posts: ['posts'] as const,
  popular: () => [...POST_QUERY_KEYS.posts, 'popular'] as const,
  follows: () => [...POST_QUERY_KEYS.posts, 'follows'] as const,
  recommends: () => [...POST_QUERY_KEYS.posts, 'recommends'] as const,
  byFeedId: (feedId: string) =>
    [...POST_QUERY_KEYS.posts, 'feedId', feedId] as const,
} as const;

// ID 기반 통합 훅
export const usePostsByFeedId = (
  feedId: string,
  options?: UseQueryCustomOptions<PostsDTO>,
) => {
  return useQuery({
    queryKey: POST_QUERY_KEYS.byFeedId(feedId),
    queryFn: () => fetchPostsByFeedId(feedId),
    enabled: !!feedId,
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    ...options,
  });
};
