// @/constants/types.ts
import {mockPosts} from './dummyData';

// Post
export interface User {
  profileImg: string;
  nickName: string;
}

export interface BestComment {
  userId: string;
  content: string;
  profileImg: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userProfileImg: string;
  content: string;
  createdAgo: number;
  likeCount: number;
  commentCount?: number;
  replies?: Comment[];
}

export type Post = {
  id: string;
  userId: string;
  title: string;
  content: string;
  mediaType: string;
  mediaUrl?: string;
  createdAgo: number;
  likeCount: number;
  commentCount: number;
  tags: string[];
  bestComment?: BestComment;
  user: User;
};

// YouTube Video
export interface YouTubeVideo {
  id: string;
  title: string;
  channel: string;
  duration: string;
  thumbnail: string;
}

// Search
export interface PopularMedia {
  userNickname: string;
  userProfileImgLink: string;
  postID: string;
  mediaURL: string;
  mediaType: string;
  createdAgo: string;
}

// HarmonyRoom
// 최근 업로드 미디어
export interface RecentHarmonyRoom {
    userNickname: string;
    userProfileImgLink: string;
    roomID: string;
    mediaURL: string;
    mediaType: string;
    createdAgo: number;
    }

// 추천 하모니룸
export interface RecommendRoom {
    roomID: sting;
    title: string;
    tags : string[];
    memberNum : number;
    roomProfileImgLink: string;
    ownerId?: string;
    content: string;
    memberProfileImg: string[];
};

export interface HarmonyRoomInfo {
    roomID: string;
    title : string;
    categories : string[];
    createdAgo: string;
    roomProfileImgLink: string;
    description: string;
    isConfirm: boolean;
    feed?: Post[];
    ownerId?: string;
};

// HarmonyRoomChat
export interface Chat{
    id: string,
    sender: 'other' | 'system' | 'me',
    nickName?: string,
    message: string,
    time?: string,
};


// Feed Type 정의
export interface FeedType {
  id: string;
  name: string;
  posts?: Post[];
}

// Search 인터페이스
export interface PopularMedia {
  userNickname: string;
  userProfileImgLink: string;
  postID: string;
  mediaURL: string;
  mediaType: string;
  createdAgo: string;
}

// 피드 타입 데이터 생성 함수
export const createFeedTypes = (contextPosts: Post[]): FeedType[] => {
  // 중복 제거를 위해 Set 사용
  const allPostsMap = new Map();

  // contextPosts 먼저 추가
  contextPosts.forEach(post => allPostsMap.set(post.id, post));

  // mockPosts 추가 (중복된 ID는 덮어쓰지 않음)
  mockPosts.forEach(post => {
    if (!allPostsMap.has(post.id)) {
      allPostsMap.set(post.id, post);
    }
  });

  const uniquePosts = Array.from(allPostsMap.values());

  return [
    {
      id: 'recommended',
      name: '추천 피드',
      posts: uniquePosts, // 중복 제거된 포스트들
    },
    {
      id: 'popular',
      name: '인기 피드',
      posts: mockPosts.slice(1, 3), // 일부만 표시
    },
    {
      id: 'following',
      name: '내 팔로우',
      posts: mockPosts.slice(3, 4), // 다른 일부 표시
    },
  ];
};

// 기본 피드 타입 (호환성을 위해 유지)
export const feedTypes: FeedType[] = createFeedTypes([]);

export const realTimeData: Post[] = [
  {
    id: 'post005',
    userId: 'user123',
    title: '',
    content:
      "바흐의 '무반주 바이올린 모음곡 1번'은 언제 들어도 마음이 맑아지는 느낌임. 선율은 단순한데 뭔가 감동을 주는 느낌..? 오늘 아침 산책하며 들었는데 좋아서 추천함!!",
    mediaType: 'youtube',
    mediaUrl: 'https://youtu.be/VY7moMlUvg4',
    createdAgo: 2,
    likeCount: 201,
    commentCount: 16,
    tags: ['바흐', '바이올린_모음곡'],
    bestComment: {
      userId: 'user999',
      content: '감사합니다! 한 번 들어볼게요',
      profileImg:
        'https://images.pexels.com/photos/248510/pexels-photo-248510.jpeg',
    },
    user: {
      nickName: '토마토클래식',
      profileImg:
        'https://i.pinimg.com/736x/50/e3/0c/50e30c49279009badabf03b0fbf02a33.jpg',
    },
  },
];
