import instance from '../axiosInstance';
import type {BaseResponse} from '../baseResponse';
import type {NewPostDTO} from '@/types';

// #3) CRUD operations for post (POST/PATCH/DELETE requests)
// POST /api/posts (게시글 작성)
export const createPost = async (postData: NewPostDTO): Promise<void> => {
  const res = await instance.post('/api/posts', postData);
  return res.data.data;
};

// DELETE /api/posts/{postId} (게시글 삭제)
export const deletePost = async (postId: string) => {
  const res = await instance.delete<BaseResponse<null>>(`/api/posts/${postId}`);
  return res.data.data;
};

// #4) post stats (mutations)
// 1) like
// POST /api/posts/{postId}/like (게시글 좋아요 토글)
export const togglePostLike = async (postId: string) => {
  const res = await instance.post<BaseResponse<null>>(
    `/api/posts/${postId}/like`,
  );
  return res.data.data; // { action, liked, likeCount }
};

// 2) bookmark
// GET /api/posts/{postId}/bookmark (게시글 북마크 추가)
export const addPostBookmark = async (postId: string) => {
  const res = await instance.post<BaseResponse<null>>(
    `/api/posts/${postId}/bookmark`,
  );
  return res.data.data;
};

// DELETE /api/posts/{postId}/bookmarks (게시글 북마크 제거)
export const deletePostBookmark = async (postId: string) => {
  const res = await instance.delete<BaseResponse<null>>(
    `/api/posts/${postId}/bookmarks`,
  );
  return res.data.data;
};

// 3) comment (mutations)
// POST /api/posts/{postId}/comment (게시글 댓글 작성)
export const createComment = async (
  postId: string,
  body: {content: string; responseTo: string | null},
) => {
  const res = await instance.post<BaseResponse<null>>(
    `/api/posts/${postId}/comment`,
    body,
  );
  return res.data.data;
};

// DELETE /api/posts/{postId}/comments/{commentId} (댓글 삭제)
export const deleteComment = async (postId: string, commentId: string) => {
  const res = await instance.delete<BaseResponse<null>>(
    `/api/posts/${postId}/comments/${commentId}`,
  );
  return res.data.data;
};

// PATCH /api/posts/{postId}/comments/{commentId} (댓글 좋아요 토글)
export const toggleCommentLike = async (postId: string, commentId: string) => {
  const res = await instance.patch<BaseResponse<null>>(
    `/api/posts/${postId}/comments/${commentId}`,
  );
  return res.data.data;
};

// 4) hide post
// POST /api/posts/{postId}/hidden (피드 숨기기)
export const hidePost = async (postId: string) => {
  const res = await instance.post<BaseResponse<null>>(
    `/api/posts/${postId}/hidden`,
  );
  return res.data.data;
};
