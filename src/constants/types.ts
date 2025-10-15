// @/constants/types.ts
import {mockPosts} from './dummyData';

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
  tags: string[];
  memberNum: number;
  roomProfileImgLink: string;
  ownerId?: string;
  content: string;
  memberProfileImg: string[];
}

export interface HarmonyRoomInfo {
  roomID: string;
  title: string;
  categories: string[];
  createdAgo: string;
  roomProfileImgLink: string;
  description: string;
  isConfirm: boolean;
  feed?: Post[];
  ownerId?: string;
}

// HarmonyRoomChat
export interface Chat {
  id: string;
  sender: 'other' | 'system' | 'me';
  nickName?: string;
  message: string;
  time?: string;
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

// 캘린더 공연 인터페이스
export interface Performance {
  id: number;
  title: string;
  location: string;
  startDate: Date;
  endDate?: Date;
  isBookmark: boolean;
  leftDate?: number;
  category: string;
  imaUrl?: string;
}

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
