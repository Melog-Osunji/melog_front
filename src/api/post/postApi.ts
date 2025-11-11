import instance from '../axiosInstance';
import type {BaseResponse} from '../baseResponse';
import type {
  PostsDTO,
  CommentsDTO,
  FeedId,
  PostWithUserDTO,
  NewPostDTO,
} from '@/types';
import {FEED_IDS} from '@/constants';

// #1 feed
export const fetchPopularPosts = async (): Promise<PostsDTO> => {
  const res = await instance.get<BaseResponse<PostsDTO>>('/api/posts/populars');
  return res.data.data;
};

export const fetchFollowPosts = async (): Promise<PostsDTO> => {
  const res = await instance.get<BaseResponse<PostsDTO>>('/api/posts/follows');
  return res.data.data;
};

export const fetchRecommendPosts = async (): Promise<PostsDTO> => {
  const res = await instance.get('/api/posts/recommends');

  // (임시 err 처리) 서버가 BaseResponse<T>를 따르지 않고 { results: [...] } 형태로 반환하는 경우를 처리
  // 우선 순위: res.data.data (BaseResponse) -> res.data (raw payload)
  const payload = (res.data as any)?.data ?? res.data;

  if (!payload) {
    console.warn(
      '[postApi.ts] /api/posts/recommends payload 비어있음 → 빈 결과 반환',
    );
    return {results: []} as PostsDTO;
  }

  return payload as PostsDTO;
};

// feed - id mapping
const FEED_API_MAP: Record<FeedId, () => Promise<PostsDTO>> = {
  [FEED_IDS.POPULAR]: fetchPopularPosts,
  [FEED_IDS.FOLLOW]: fetchFollowPosts,
  [FEED_IDS.RECOMMEND]: fetchRecommendPosts,
} as const;

export const fetchPostsByFeedId = async (feedId: FeedId): Promise<PostsDTO> => {
  const apiFunction = FEED_API_MAP[feedId];

  if (!apiFunction) {
    return fetchPopularPosts(); //err : 알 수 없는 피드 아이디 - 인기 피드로 대체
  }

  return apiFunction();
};

//#2 post detail
export const fetchPostDetail = async (
  postId: string,
): Promise<PostWithUserDTO> => {
  const res = await instance.get<BaseResponse<PostWithUserDTO>>(
    `/api/posts/${postId}`,
  );
  return res.data.data;
};

export const fetchPostComments = async (
  postId: string,
): Promise<CommentsDTO> => {
  const res = await instance.get<BaseResponse<CommentsDTO>>(
    `/api/posts/${postId}/comments`,
  );
  return res.data.data;
};

// #3 CRUD operations for post
// create post
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

// #4 post stats
// like
export const togglePostLike = async (postId: string) => {
  const res = await instance.post<BaseResponse<any>>(
    `/api/posts/${postId}/like`,
  );
  return res.data.data; // { action, liked, likeCount }
};

// bookmark
export const togglePostBookmark = async (postId: string) => {
  const res = await instance.get<BaseResponse<any>>(
    `/api/posts/${postId}/bookmarks`,
  );
  return res.data.data;
};

// comment
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
