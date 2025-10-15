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

// # feed
export const fetchPopularPosts = async (): Promise<PostsDTO> => {
  const res = await instance.get<BaseResponse<PostsDTO>>('/api/posts/populars');
  return res.data.data;
};

export const fetchFollowPosts = async (): Promise<PostsDTO> => {
  const res = await instance.get<BaseResponse<PostsDTO>>('/api/posts/follows');
  return res.data.data;
};

export const fetchRecommendPosts = async (): Promise<PostsDTO> => {
  const res = await instance.get<BaseResponse<PostsDTO>>(
    '/api/posts/recommends',
  );
  return res.data.data;
};

// feed - id
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

//# post detail
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

// # CRUD operations for post
// create post
export const createPost = async (postData: NewPostDTO): Promise<void> => {
  console.log('[postApi] 게시글 작성 요청 시작:', postData);

  try {
    // ✅ 요청 직전 상태 확인
    console.log('[postApi] 요청 URL:', '/api/posts');
    console.log('[postApi] 요청 방법:', 'POST');
    console.log('[postApi] 요청 바디:', JSON.stringify(postData, null, 2));

    const res = await instance.post('/api/posts', postData);

    console.log('[postApi] 게시글 작성 응답:', res.data);

    if (!res.data.success) {
      throw new Error('게시글 작성에 실패했습니다.');
    }
  } catch (error) {
    // ✅ 상세 에러 로깅
    console.error('[postApi] 에러 발생:');
    if (
      typeof error === 'object' &&
      error !== null &&
      'response' in error &&
      error.response &&
      typeof error.response === 'object'
    ) {
      console.error('[postApi] 응답 상태:', (error as any).response.status);
      console.error('[postApi] 응답 데이터:', (error as any).response.data);
      console.error('[postApi] 응답 헤더:', (error as any).response.headers);
      console.error('[postApi] 요청 설정:', (error as any).config);
    }
    throw error;
  }
};

// del post

// # post stats
// like
// comment
// bookmark
