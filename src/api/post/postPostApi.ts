import instance from '../axiosInstance';
import type {BaseResponse} from '../baseResponse';
import type {NewPostDTO} from '@/types';

// #3) CRUD operations for post (POST/PATCH/DELETE requests)
// POST /api/posts (게시글 작성)
export const createPost = async (postData: NewPostDTO): Promise<void> => {
  try {
    const res = await instance.post('/api/posts', postData);

    if (!res.data.success) {
      throw new Error('게시글 작성에 실패했습니다.');
    }
  } catch (error) {
    throw error;
  }
};

// del post
// DELETE /api/posts/{postId}
export const deletePost = async (postId: string) => {
  try {
    const res = await instance.delete<BaseResponse<any>>(
      `/api/posts/${postId}`,
    );

    if (!res.data.success) {
      throw new Error('게시글 삭제에 실패했습니다.');
    }

    return res.data.data;
  } catch (error) {
    throw error;
  }
};

// #4) post stats (mutations)
// 1) like
// POST /api/posts/{postId}/like (게시글 좋아요 토글)
export const togglePostLike = async (postId: string) => {
  const res = await instance.post<BaseResponse<any>>(
    `/api/posts/${postId}/like`,
  );
  return res.data.data; // { action, liked, likeCount }
};

// 3) comment (mutations)
// POST /api/posts/{postId}/comment (게시글 댓글 작성)
export const createComment = async (
  postId: string,
  body: {content: string; responseTo: string | null},
) => {
  const res = await instance.post<BaseResponse<any>>(
    `/api/posts/${postId}/comment`,
    body,
  );
  return res.data.data;
};

// comment like
// PATCH /api/posts/{postId}/comments/{commentId} (댓글 좋아요 토글)
export const toggleCommentLike = async (postId: string, commentId: string) => {
  const res = await instance.patch<BaseResponse<any>>(
    `/api/posts/${postId}/comments/${commentId}`,
  );
  return res.data.data;
};
