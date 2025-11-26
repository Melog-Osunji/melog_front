import { useQuery } from '@tanstack/react-query';
import {
  fetchHarmonyPostDetail,
  fetchPostComments,
  fetchPostBestComments,
  type HarmonyPostDTO,
} from '@/api/harmonyRoom/harmonyRoomFeedApi';
import type { PostWithUserDTO, CommentsDTO, BestCommentDTO } from '@/types';

// =====================
// #0) 하모니룸 쿼리 키
// =====================
export const HARMONY_POST_QK = {
  post: ['harmony', 'post'] as const,
  detail: (postId: string) => [...HARMONY_POST_QK.post, 'detail', postId] as const,
  comments: (postId: string) => [...HARMONY_POST_QK.post, 'comments', postId] as const,
  bestComments: (postId: string) => [...HARMONY_POST_QK.post, 'bestComments', postId] as const,
} as const;

// =====================
// #1) 게시글 상세
// =====================
export const useHarmonyPostDetail = (postId: string) => {
  return useQuery<HarmonyPostDTO, Error>({
    queryKey: HARMONY_POST_QK.detail(postId),
    queryFn: () => fetchHarmonyPostDetail(postId),
    enabled: !!postId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};

// =====================
// #2) 게시글 댓글 목록
// =====================
export const useHarmonyPostComments = (postId: string) => {
  return useQuery<CommentsDTO, Error>({
    queryKey: HARMONY_POST_QK.comments(postId),
    queryFn: () => fetchPostComments(postId),
    enabled: !!postId,
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 5,
  });
};

// =====================
// #3) 베스트 댓글 조회
// =====================
export const useHarmonyPostBestComments = (postId: string) => {
  return useQuery<BestCommentDTO, Error>({
    queryKey: HARMONY_POST_QK.bestComments(postId),
    queryFn: () => fetchPostBestComments(postId),
    enabled: !!postId,
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 5,
  });
};
