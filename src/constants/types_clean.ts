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

// Search 인터페이스
export interface PopularMedia {
  userNickname: string;
  userProfileImgLink: string;
  postID: string;
  mediaURL: string;
  mediaType: string;
  createdAgo: string;
}

// HarmonyRoom
export interface HarmonyRoomInfo {
  roomID: string;
  title: string;
  tags: string[];
  seeNum: number;
  createdAgo: string;
  mediaURL: string;
  mediaType: string;
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

// HarmonyRoomCard Dummy
export const HarmonyRoomDummyData: HarmonyRoomInfo[] = [
  {
    roomID: 'room001',
    title: '베토벤 교향곡 7번 감상🎧',
    tags: ['기분전환', '베토벤'],
    seeNum: 12,
    createdAgo: '1시간 전',
    mediaURL: 'https://youtu.be/AigCY0MQb5c',
    mediaType: 'YouTube',
  },
  {
    roomID: 'room002',
    title: '비 오는 날엔 드뷔시',
    tags: ['인상주의', '드뷔시'],
    seeNum: 8,
    createdAgo: '10분 전',
    mediaURL: 'https://youtu.be/Gu00H2ypeQY',
    mediaType: 'YouTube',
  },
  {
    roomID: 'room003',
    title: '영화 속 클래식🎬 모음',
    tags: ['OST클래식'],
    seeNum: 5,
    createdAgo: '1시간 전',
    mediaURL: 'https://youtu.be/_4Ecu-l2iH4',
    mediaType: 'YouTube',
  },
  {
    roomID: 'room004',
    title: '내가 만든 [Playlist]',
    tags: ['클래식', 'playlist'],
    seeNum: 15,
    createdAgo: '2시간 전',
    mediaURL: 'https://youtu.be/URPKkKMyBaQ',
    mediaType: 'YouTube',
  },
];
