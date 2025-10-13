import type {FeedId, FeedType, PostWithUserDTO} from '@/types';

export const FEED_INFOS = [
  {id: 'popular' as const, label: '인기 피드'},
  {id: 'follow' as const, label: '내 팔로우'},
  {id: 'recommend' as const, label: '추천 피드'},
] satisfies {id: FeedId; label: string}[];

export const FEED_IDS = {
  POPULAR: 'popular' as const,
  FOLLOW: 'follow' as const,
  RECOMMEND: 'recommend' as const,
} satisfies Record<string, FeedId>;

export const createFeedTypes = (posts: PostWithUserDTO[]): FeedType[] =>
  FEED_INFOS.map(info => ({
    ...info,
    posts,
  }));

export const defaultFeedTypes: FeedType[] = createFeedTypes([]);
