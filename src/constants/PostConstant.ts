import type {FeedId, FeedType, PostWithUserDTO} from '@/types';

export const FEED_INFOS = [
  {
    id: 'popular' as const,
    icon: require('@/assets/icons/post/Popular.png'),
    label: '인기 피드',
  },
  {
    id: 'recommend' as const,
    icon: require('@/assets/icons/post/Recommend.png'),
    label: '추천 피드',
  },
  {
    id: 'follow' as const,
    icon: require('@/assets/icons/post/Follow.png'),
    label: '내 팔로우',
  },
] satisfies {id: FeedId; icon: any; label: string}[];

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
