import instance from '../axiosInstance';
import type {BaseResponse} from '../baseResponse';
import type {NewPostDTO} from '@/types';
import type {PostsDTO, CommentsDTO, PostDTO, UserDTO, PostWithUserDTO, BestCommentDTO} from '@/types';
import {FEED_IDS} from '@/constants';

// GET (게시글 상세)
export type HarmonyPostDTO = {
    PostDTO,
    user: UserDTO,
}

export const fetchHarmonyPostDetail = async (
  postId: string,
): Promise<HarmonyPostDTO> => {
  const res = await instance.get<BaseResponse<HarmonyPostDTO>>(
    `/api/harmony/posts/${postId}`,
  );

  return res.data.data;
};

// GET (게시글 댓글 목록)
export const fetchPostComments = async (
  harmonyPostID: string,
): Promise<CommentsDTO> => {
  const res = await instance.get<BaseResponse<CommentsDTO>>(
    `/api/harmony/posts/${harmonyPostID}/comments`,
  );
  return res.data.data;
};

// GET (게시글 베스트 댓글)
export const fetchPostBestComments = async (
  harmonyPostID: string,
): Promise<BestCommentDTO> => {
  const res = await instance.get<BaseResponse<BestCommentDTO>>(
    `/api/harmony/posts/${harmonyPostID}/bestComment`,
  );
  return res.data.data;
};

// DELETE (게시글 삭제)
export const deleteHarmonyPost = async (postId: string) => {
  const res = await instance.delete<BaseResponse<null>>(`/api/harmony/posts/${postId}`);
  return res.data.data;
};

// #4) post stats (mutations)
// 1) like
// POST (게시글 좋아요 토글)
export const toggleHarmonyPostLike = async (postId: string) => {
  const res = await instance.post<BaseResponse<null>>(
    `/api/harmony/posts/${postId}/like`,
  );
  return res.data.data; // { action, liked, likeCount }
};

// 2) bookmark
// GET (게시글 북마크)
export const addHarmonyPostBookmark = async (postId: string) => {
  const res = await instance.post<BaseResponse<null>>(
    `/api/harmony/posts/${postId}/bookmark`,
  );
  return res.data.data;
};

// DELETE (게시글 북마크)
export const deleteHarmonyPostBookmarks = async (postId: string) => {
  const res = await instance.delete<BaseResponse<null>>(
    `/api/harmony/posts/${postId}/bookmarks`,
  );
  return res.data.data;
};

// 3) comment (mutations)
// POST (게시글 댓글 작성)
export const createHarmonyComment = async (
  postId: string,
  body: {content: string; responseTo: string | null},
) => {
  const res = await instance.post<BaseResponse<null>>(
    `/api/harmony/posts/${postId}/comment`,
    body,
  );
  return res.data.data;
};

// DELETE (댓글 삭제)
export const deleteHarmonyComment = async (postId: string, commentId: string) => {
  const res = await instance.delete<BaseResponse<null>>(
    `/api/harmony/posts/${postId}/comments/${commentId}`,
  );
  return res.data.data;
};

// PATCH (댓글 좋아요 토글)
export const toggleHarmonyCommentLike = async (postId: string, commentId: string) => {
  const res = await instance.patch<BaseResponse<null>>(
    `/api/harmony/posts/${postId}/comments/${commentId}`,
  );
  return res.data.data;
};

// PATCH (게시글 수정)
export const editHarmonyPost = async (postId: string) => {
  const res = await instance.patch<BaseResponse<null>>(
    `/api/harmony/posts/{postId}`
  );
  return res.data.data;
}