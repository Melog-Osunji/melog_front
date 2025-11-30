import instance from '../axiosInstance';
import type {BaseResponse} from '../baseResponse';
import type {NewPostDTO} from '@/types';

export type ReportRequest = {
  userID: string | null;
  reason: string;
  postId?: string | null;
  commentId?: string | null;
  reportedUserId?: string | null;
};

export type TogglePostLikeResponse = {
  action: '취소' | '추가';
  liked: boolean;
  likeCount: number;
};

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
  const res = await instance.post<BaseResponse<TogglePostLikeResponse>>(
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

// POST /api/report (신고)
export const postReport = async (payload: ReportRequest) => {
  // API로 전송되는 body를 콘솔에 출력
  console.debug('[postReport] payload:', JSON.stringify(payload, null, 2));

  try {
    const res = await instance.post<BaseResponse<any>>('/api/report', payload);
    return res.data.data;
  } catch (err) {
    console.error('[postReport] error:', err);
    throw err;
  }
};
