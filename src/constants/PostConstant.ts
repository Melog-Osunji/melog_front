import {FeedType, PostWithUserDTO} from '@/types';

// 피드 ID 상수
export const FEED_IDS = {
  POPULAR: 'popular',
  FOLLOW: 'follow',
  RECOMMEND: 'recommend',
} as const;

// 피드 라벨 상수
export const FEED_LABELS = {
  [FEED_IDS.POPULAR]: '인기 피드',
  [FEED_IDS.FOLLOW]: '내 팔로우',
  [FEED_IDS.RECOMMEND]: '추천 피드',
} as const;

// 피드 타입 데이터 생성 함수
export const createFeedTypes = (newPosts: PostWithUserDTO[]): FeedType[] => [
  {
    id: FEED_IDS.POPULAR,
    label: FEED_LABELS[FEED_IDS.POPULAR],
    posts: newPosts,
  },
  {
    id: FEED_IDS.FOLLOW,
    label: FEED_LABELS[FEED_IDS.FOLLOW],
    posts: newPosts,
  },
  {
    id: FEED_IDS.RECOMMEND,
    label: FEED_LABELS[FEED_IDS.RECOMMEND],
    posts: newPosts,
  },
];

// 기본 피드 타입
export const defaultFeedTypes: FeedType[] = createFeedTypes([]);

// 유틸 함수들
export const getFeedTypeById = (id: string, feedTypes: FeedType[]) => {
  return feedTypes.find(feed => feed.id === id);
};

export const getFeedTypeLabels = (feedTypes: FeedType[]) => {
  return feedTypes.map(feed => feed.label);
};

// 피드 ID 배열 (API 매핑 등에서 유용)
export const getAllFeedIds = () => Object.values(FEED_IDS);
