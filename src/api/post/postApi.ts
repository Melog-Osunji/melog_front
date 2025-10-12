import instance from '../axiosInstance';
import type {BaseResponse} from '../baseResponse';
import type {PostsDTO, FeedType, PostWithUserDTO} from '@/types';

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

type FeedId = FeedType['id']; // 'popular' | 'follow' | 'recommend'

const FEED_API_MAP: Record<FeedType['id'], () => Promise<PostsDTO>> = {
  popular: fetchPopularPosts,
  follow: fetchFollowPosts,
  recommend: fetchRecommendPosts,
} as const;

// feed - id
export const fetchPostsByFeedId = async (feedId: FeedId): Promise<PostsDTO> => {
  const apiFunction = FEED_API_MAP[feedId];

  if (!apiFunction) {
    console.warn(`알 수 없는 피드 ID: ${feedId}, 인기 피드로 대체`);
    return fetchPopularPosts();
  }

  return apiFunction();
};

//post detail
export const fetchPostDetail = async (
  postId: string,
): Promise<PostWithUserDTO> => {
  console.log(`[postApi] 게시글 상세 조회 요청: ${postId}`);

  const res = await instance.get<BaseResponse<PostWithUserDTO>>(
    `/api/posts/${postId}`,
  );

  console.log(`[postApi] 게시글 상세 조회 응답:`, res.data);

  if (!res.data.success) {
    throw new Error('게시글을 불러오는데 실패했습니다.');
  }

  return res.data.data;
};

// # CRUD operations for post
// add post
// del post

// # post stats
// like
// comment
// bookmark
