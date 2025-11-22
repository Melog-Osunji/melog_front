import {useMutation, useQueryClient} from '@tanstack/react-query';
import {
  createPost,
  togglePostLike,
  createComment,
  toggleCommentLike,
  deletePost,
} from '@/api/post/postPostApi';
import {fetchPostBookmarks} from '@/api/post/postGetApi';
import {POST_QUERY_KEYS} from './usePostQueries';
import type {NewPostDTO} from '@/types';
import {MY_PAGE_QK} from '@/hooks/queries/myPage/useMyPage';

// ======== #1) 게시글 생성 / 수정 관련 뮤테이션 훅 모음 ========
// useCreatePost: 게시글 생성 요청 및 성공 시 관련 쿼리 무효화
export const useCreatePost = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (postData: NewPostDTO) => createPost(postData),
    onSuccess: () => qc.invalidateQueries({queryKey: POST_QUERY_KEYS.posts}),
    onError: err => console.warn('[useCreatePost] 게시글 작성 실패:', err),
  });
};

// useDeletePost: 게시글 삭제 (DELETE)
export const useDeletePost = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => deletePost(postId),
    onMutate: async (postId: string) => {
      console.log('[useDeletePost] onMutate', postId);
      await qc.cancelQueries({queryKey: POST_QUERY_KEYS.posts});

      // capture previous posts-related queries and myPage cache
      const previousQueries = qc.getQueriesData(POST_QUERY_KEYS.posts) as Array<
        [any, any]
      >;
      const previousMyPage = qc.getQueryData(MY_PAGE_QK);

      // helper to extract id
      const getId = (item: any) =>
        item?.post?.id ?? item?.id ?? item?.postId ?? null;

      // optimistic update: remove the deleted post from every cached list (if array or common fields)
      previousQueries.forEach(([key, data]) => {
        if (!data) return;
        if (Array.isArray(data)) {
          qc.setQueryData(key, (old: any[] | undefined) =>
            (old || []).filter(item => getId(item) !== postId),
          );
          return;
        }
        const copy = {...data};
        let mutated = false;
        ['posts', 'data', 'items'].forEach(field => {
          if (Array.isArray(copy[field])) {
            copy[field] = copy[field].filter(
              (item: any) => getId(item) !== postId,
            );
            mutated = true;
          }
        });
        if (mutated) qc.setQueryData(key, copy);
      });

      // optimistic update for myPage (if present)
      if (previousMyPage && Array.isArray((previousMyPage as any).posts)) {
        qc.setQueryData(MY_PAGE_QK, (old: any) => {
          if (!old) return old;
          return {
            ...old,
            posts: (old.posts || []).filter((p: any) => getId(p) !== postId),
          };
        });
      }

      return {previousQueries, previousMyPage};
    },
    onError: (_err, _postId, context: any) => {
      console.warn('[useDeletePost] delete error', _err);
      // rollback: restore previous data for each affected query
      if (context?.previousQueries) {
        context.previousQueries.forEach(([key, data]: any) => {
          qc.setQueryData(key, data);
        });
      }
      if (context?.previousMyPage) {
        qc.setQueryData(MY_PAGE_QK, context.previousMyPage);
      }
    },
    onSuccess: (data, postId) => {
      console.log('[useDeletePost] success', postId, data);
    },
    onSettled: (_data, _error, postId) => {
      console.log('[useDeletePost] onSettled invalidate', postId);
      // invalidate posts-related queries and myPage so server is authoritative
      qc.invalidateQueries(POST_QUERY_KEYS.posts);
      qc.invalidateQueries(MY_PAGE_QK);
      if (postId) qc.invalidateQueries({queryKey: ['post', postId]});
    },
  });
};

// ======== #2) 게시글 통계(좋아요, 북마크) 관련 뮤테이션 훅 ========
// useTogglePostLike: 게시글 좋아요 토글
export const useTogglePostLike = () =>
  useMutation({
    mutationFn: (postId: string) => togglePostLike(postId),
    onError: err => console.warn('[useTogglePostLike] 좋아요 토글 실패:', err),
  });

// useTogglePostBookmark: 게시글 북마크 토글
export const useTogglePostBookmark = () =>
  useMutation({
    // 북마크 엔드포인트는 GET 기반이므로 get 함수를 호출
    mutationFn: (postId: string) => fetchPostBookmarks(postId),
    onError: err =>
      console.warn('[useTogglePostBookmark] 북마크 토글 실패:', err),
  });

// ======== #3) 댓글 관련 뮤테이션 훅 ========
// useCreateComment: 댓글 작성 및 성공 시 댓글 목록/포스트 목록 캐시 무효화
export const useCreateComment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      postId: string;
      content: string;
      responseTo: string | null;
    }) =>
      createComment(payload.postId, {
        content: payload.content,
        responseTo: payload.responseTo,
      }),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({queryKey: ['post', 'comments', variables.postId]});
      qc.invalidateQueries({queryKey: POST_QUERY_KEYS.posts});
    },
    onError: err => console.warn('[useCreateComment] 댓글 작성 실패:', err),
  });
};

// useToggleCommentLike: 댓글 좋아요 토글, 서버 반환에 따라 캐시 업데이트 또는 무효화 처리
export const useToggleCommentLike = () => {
  const qc = useQueryClient();
  return useMutation<any, Error, {postId: string; commentId: string}>({
    mutationFn: ({postId, commentId}) => toggleCommentLike(postId, commentId),
    onSuccess: (data, variables) => {
      if (!data) {
        qc.invalidateQueries({
          queryKey: ['post', 'comments', variables.postId],
        });
        qc.invalidateQueries({queryKey: POST_QUERY_KEYS.posts});
        return;
      }
      // 서버가 likeCount 등을 반환하면 필요한 캐시 업데이트 시도
      qc.invalidateQueries({queryKey: POST_QUERY_KEYS.posts});
    },
    onError: err =>
      console.warn('[useToggleCommentLike] 댓글 좋아요 토글 실패:', err),
  });
};
