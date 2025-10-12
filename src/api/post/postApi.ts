import instance from '../axiosInstance';
import type {BaseResponse} from '../baseResponse';
import type {
  PostsDTO,
  CommentsDTO,
  FeedType,
  FeedId,
  PostWithUserDTO,
} from '@/types';

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
const FEED_API_MAP: Record<FeedType['id'], () => Promise<PostsDTO>> = {
  popular: fetchPopularPosts,
  follow: fetchFollowPosts,
  recommend: fetchRecommendPosts,
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
// add post
// del post

// # post stats
// like
// comment
// bookmark
