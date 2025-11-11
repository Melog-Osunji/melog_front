import {useQuery} from '@tanstack/react-query';
import {
  fetchPostsByFeedId,
  fetchPostDetail,
  fetchPostComments,
} from '@/api/post/postApiGet';
import type {PostsDTO, PostWithUserDTO, CommentsDTO} from '@/types';
import type {FeedId} from '@/types';

// #1) 피드 관련 - 쿼리 키 상수
// POST_QUERY_KEYS: 피드/게시글 관련 쿼리 키를 중앙에서 관리
export const POST_QUERY_KEYS = {
  posts: ['posts'] as const,
  popular: () => [...POST_QUERY_KEYS.posts, 'popular'] as const,
  follows: () => [...POST_QUERY_KEYS.posts, 'follows'] as const,
  recommends: () => [...POST_QUERY_KEYS.posts, 'recommends'] as const,
  byFeedId: (feedId: FeedId) =>
    [...POST_QUERY_KEYS.posts, 'feedId', feedId] as const,
} as const;

// usePostsByFeedId: feedId에 따라 서버에서 게시글 목록을 조회
export const usePostsByFeedId = (feedId: FeedId) => {
  return useQuery<PostsDTO, Error>({
    queryKey: POST_QUERY_KEYS.byFeedId(feedId),
    queryFn: () => fetchPostsByFeedId(feedId),
    enabled: !!feedId,
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// #2) 게시글 상세 및 댓글 관련
// usePostDetail: 게시글 상세 조회
export const usePostDetail = (postId: string) => {
  return useQuery<PostWithUserDTO, Error>({
    queryKey: ['post', 'detail', postId],
    queryFn: () => fetchPostDetail(postId),
    enabled: !!postId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};

// usePostComments: 특정 게시글의 댓글 목록 조회
export const usePostComments = (postId: string) => {
  return useQuery<CommentsDTO, Error>({
    queryKey: ['post', 'comments', postId],
    queryFn: () => fetchPostComments(postId),
    enabled: !!postId,
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 5,
  });
};
