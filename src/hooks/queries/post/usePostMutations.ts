import {useMutation, useQueryClient} from '@tanstack/react-query';
import {
  createPost,
  togglePostLike,
  createComment,
  toggleCommentLike,
} from '@/api/post/postPostApi';
import {fetchPostBookmarks} from '@/api/post/postApiGet';
import {POST_QUERY_KEYS} from './usePostQueries';
import type {NewPostDTO} from '@/types';

// #1) 게시글 생성 / 수정 관련 뮤테이션 훅 모음
// useCreatePost: 게시글 생성 요청 및 성공 시 관련 쿼리 무효화
export const useCreatePost = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (postData: NewPostDTO) => createPost(postData),
    onSuccess: () => qc.invalidateQueries({queryKey: POST_QUERY_KEYS.posts}),
    onError: err => console.warn('[useCreatePost] 게시글 작성 실패:', err),
  });
};

// #2) 게시글 통계(좋아요, 북마크) 관련 뮤테이션 훅
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

// #3) 댓글 관련 뮤테이션 훅
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
