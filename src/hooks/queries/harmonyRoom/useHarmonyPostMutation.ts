import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  deleteHarmonyPost,
  toggleHarmonyPostLike,
  addHarmonyPostBookmark,
  deleteHarmonyPostBookmarks,
  createHarmonyComment,
  deleteHarmonyComment,
  toggleHarmonyCommentLike,
} from '@/api/harmonyRoom/harmonyRoomFeedApi';
import { HarmonyQueryKeys } from '@/hooks/queries/harmonyRoom/useHarmonyRoomGet';
import { HARMONY_POST_QK } from './useHarmonyPostQueries';

// ======================================
// #1) 게시글 삭제
// ======================================
export const useDeleteHarmonyPost = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => deleteHarmonyPost(postId),

    onSuccess: (_data, postId) => {
      qc.invalidateQueries({ queryKey: HARMONY_POST_QK.post });
      qc.invalidateQueries({ queryKey: HARMONY_POST_QK.detail(postId) });
    },

    onError: err => {
      console.warn('[useDeleteHarmonyPost] 게시글 삭제 실패:', err);
    },
  });
};

// ======================================
// #2) 게시글 좋아요 토글
// ======================================
export const useToggleHarmonyPostLike = (harmonyId: string) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => toggleHarmonyPostLike(postId),
    onSuccess: (_data, postId) => {
      qc.invalidateQueries({ queryKey: HARMONY_POST_QK.detail(postId) });
      qc.invalidateQueries({ queryKey: HarmonyQueryKeys.roomPosts(harmonyId) });
    },
    onError: err => console.warn('[useToggleHarmonyPostLike] 실패:', err),
  });
};

// ======================================
// #3) 게시글 북마크 토글
// ======================================
export const useToggleHarmonyPostBookmark = (harmonyId: string) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, current }: { postId: string, current:boolean; }) => {
      if (current) {
        return await deleteHarmonyPostBookmarks(postId);
      }
      return await addHarmonyPostBookmark(postId);
    },

    onSuccess: (_data, variables) => {
      const { postId } = variables;
      qc.invalidateQueries({ queryKey: HARMONY_POST_QK.detail(postId) });

      if (harmonyId) {
        qc.invalidateQueries({
          queryKey: HarmonyQueryKeys.roomPosts(harmonyId),
        });
      }
    },

    onError: err => {
      console.warn('[useToggleHarmonyPostBookmark] 실패:', err);
    },
  });
};


// 북마크 해제
// export const useDeleteHarmonyPostBookmark = () => {
//   return useMutation({
//     mutationFn: (postId: string) => deleteHarmonyPostBookmarks(postId),
//     onError: err => console.warn('[useDeleteHarmonyPostBookmark] 실패:', err),
//   });
// };

// ======================================
// #4) 댓글 작성
// ======================================
export const useCreateHarmonyComment = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      postId: string;
      content: string;
      responseTo: string | null;
    }) =>
      createHarmonyComment(payload.postId, {
        content: payload.content,
        responseTo: payload.responseTo,
      }),

    onSuccess: (_data, variables) => {
      qc.invalidateQueries({
        queryKey: HARMONY_POST_QK.comments(variables.postId),
      });
    },

    onError: err => console.warn('[useCreateHarmonyComment] 실패:', err),
  });
};

// ======================================
// #5) 댓글 좋아요 토글
// ======================================
export const useToggleHarmonyCommentLike = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, commentId }: { postId: string; commentId: string }) =>
      toggleHarmonyCommentLike(postId, commentId),

    onSuccess: (_data, variables) => {
      qc.invalidateQueries({
        queryKey: HARMONY_POST_QK.comments(variables.postId),
      });
    },

    onError: err => console.warn('[useToggleHarmonyCommentLike] 실패:', err),
  });
};

// ======================================
// #6) 댓글 삭제
// ======================================
export const useDeleteHarmonyComment = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, commentId }: { postId: string; commentId: string }) =>
      deletHarmonyeComment(postId, commentId),

    onSuccess: (_data, variables) => {
      qc.invalidateQueries({
        queryKey: HARMONY_POST_QK.comments(variables.postId),
      });
    },

    onError: err => console.warn('[useDeleteHarmonyComment] 실패:', err),
  });
};
