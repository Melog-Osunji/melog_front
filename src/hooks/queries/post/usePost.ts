import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {
  fetchPostsByFeedId,
  fetchPostDetail,
  fetchPostComments,
  createPost,
  togglePostLike,
  togglePostBookmark,
} from '@/api/post/postApi';
import type {PostsDTO, PostWithUserDTO, CommentsDTO, NewPostDTO} from '@/types';
import {FeedId} from '@/types';

// #1 feed
// query 키 상수
export const POST_QUERY_KEYS = {
  posts: ['posts'] as const,
  popular: () => [...POST_QUERY_KEYS.posts, 'popular'] as const,
  follows: () => [...POST_QUERY_KEYS.posts, 'follows'] as const,
  recommends: () => [...POST_QUERY_KEYS.posts, 'recommends'] as const,
  byFeedId: (feedId: FeedId) =>
    [...POST_QUERY_KEYS.posts, 'feedId', feedId] as const,
} as const;

// feed - id
export const usePostsByFeedId = (feedId: FeedId) => {
  return useQuery<PostsDTO, Error>({
    queryKey: POST_QUERY_KEYS.byFeedId(feedId), // 이제 각 feedId마다 다른 키 생성
    queryFn: () => fetchPostsByFeedId(feedId),
    enabled: !!feedId,
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// #2 post detail
export const usePostDetail = (postId: string) => {
  return useQuery<PostWithUserDTO, Error>({
    queryKey: ['post', 'detail', postId],
    queryFn: () => fetchPostDetail(postId),
    enabled: !!postId, // postId가 있을 때만 쿼리 실행
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
    gcTime: 1000 * 60 * 10, // 10분간 가비지 컬렉션 방지
  });
};

export const usePostComments = (postId: string) => {
  return useQuery<CommentsDTO, Error>({
    queryKey: ['post', 'comments', postId],
    queryFn: () => fetchPostComments(postId),
    enabled: !!postId,
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 5,
  });
};

// #3 CRUD operations for post
// create post
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postData: NewPostDTO) => createPost(postData),
    onSuccess: () => {
      console.log('[useCreatePost] 게시글 작성 성공');

      // 모든 피드 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: POST_QUERY_KEYS.posts,
      });
    },
    onError: error => {
      console.error('[useCreatePost] 게시글 작성 실패:', error);
    },
  });
};

// del post

// # post stats
// like
export function useTogglePostLike() {
  return useMutation({
    mutationFn: (postId: string) => togglePostLike(postId),
    onMutate: postId => {
      console.log('[usePostQueries] useTogglePostLike onMutate:', postId);
    },
    onSuccess: data => {
      console.log('[usePostQueries] useTogglePostLike onSuccess:', data);
    },
    onError: error => {
      console.log('[usePostQueries] useTogglePostLike onError:', error);
    },
  });
}

// bookmark
export function useTogglePostBookmark() {
  return useMutation({
    mutationFn: (postId: string) => togglePostBookmark(postId),
    onMutate: postId => {
      console.log('[usePostQueries] useTogglePostBookmark onMutate:', postId);
    },
    onSuccess: data => {
      console.log('[usePostQueries] useTogglePostBookmark onSuccess:', data);
    },
    onError: error => {
      console.log('[usePostQueries] useTogglePostBookmark onError:', error);
    },
  });
}

// comment
