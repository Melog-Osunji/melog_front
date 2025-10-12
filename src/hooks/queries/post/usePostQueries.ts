import {useQuery} from '@tanstack/react-query';
import {fetchPostsByFeedId, fetchPostDetail} from '@/api/post/postApi';
import type {PostWithUserDTO} from '@/types';
import {PostsDTO} from '@/types';
import {UseQueryCustomOptions} from '@/types';

// # feed
// query 키 상수
export const POST_QUERY_KEYS = {
  posts: ['posts'] as const,
  popular: () => [...POST_QUERY_KEYS.posts, 'popular'] as const,
  follows: () => [...POST_QUERY_KEYS.posts, 'follows'] as const,
  recommends: () => [...POST_QUERY_KEYS.posts, 'recommends'] as const,
  byFeedId: (feedId: string) =>
    [...POST_QUERY_KEYS.posts, 'feedId', feedId] as const,
} as const;

// feed - id
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

// # post detail
export const usePostDetail = (postId: string) => {
  return useQuery<PostWithUserDTO, Error>({
    queryKey: ['post', 'detail', postId],
    queryFn: () => fetchPostDetail(postId),
    enabled: !!postId, // postId가 있을 때만 쿼리 실행
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
    gcTime: 1000 * 60 * 10, // 10분간 가비지 컬렉션 방지
  });
};
