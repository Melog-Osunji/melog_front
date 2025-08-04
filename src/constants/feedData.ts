import {FeedType} from '@/types/domain';
import {mockPosts} from '@/constants/types';

// 더미 피드 데이터
export const feedTypes: FeedType[] = [
  {
    id: 'recommended',
    name: '추천 피드',
    posts: mockPosts,
  },
  {
    id: 'popular',
    name: '인기 피드',
    posts: mockPosts.slice(0, 3), // 일부만 표시
  },
  {
    id: 'following',
    name: '내 팔로우',
    posts: mockPosts.slice(1, 4), // 다른 일부 표시
  },
];
