// @/constants/types.ts

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

//dummy data
export const mockPosts: Post[] = [
  {
    id: 'post001',
    userId: 'user001',
    title: '',
    content:
      '드뷔시 피아노곡을 들으며 창밖을 봤는데, 내가 유럽에 왔나 싶을 정도록 하늘이 예뻐보이더라고요. 잔잔한 음악 덕분에 아침부터 힐링합니다.',
    mediaType: 'youtube',
    mediaUrl: 'https://youtu.be/sJ8EtgDXAHI?si=1wOUBIFIK2gQOT7U',
    createdAgo: 6,
    likeCount: 24,
    commentCount: 5,
    tags: ['드뷔시', '아라베스크'],
    bestComment: {
      userId: 'user999',
      content: '드뷔시의 아라베스크는 들으면 눈물이 날 정도로 감동적입니다.',
      profileImg:
        'https://images.pexels.com/photos/248510/pexels-photo-248510.jpeg',
    },
    user: {
      nickName: '루나',
      profileImg:
        'https://images.pexels.com/photos/736230/pexels-photo-736230.jpeg',
    },
  },
  {
    id: 'post002',
    userId: 'user002',
    title: '',
    content:
      "바흐의 무반주 첼로 모음곡 1번 프렐류드를 아침에 들었어요.\n바흐는 이 곡을 '보여주기'가 아니라, '묵상'의 형태로 썼다고 하더라고요. 어떤 해석에서는 \"첼로를 통해 기도한다\"는 표현도 있다 하더라고요.",
    mediaType: 'youtube',
    mediaUrl: 'https://youtu.be/EQkNmAARSe0?si=ctodimSzwFHyWyu7',
    createdAgo: 3,
    likeCount: 38,
    commentCount: 12,
    tags: ['바흐', '프렐류드'],
    bestComment: {
      userId: 'user999',
      content:
        '바흐의 첼로 모음곡은 정말 영혼을 정화시켜주는 것 같아요. 특히 요요마의 연주로 들으면 눈물이 날 정도로 감동적입니다.',
      profileImg:
        'https://images.pexels.com/photos/1370750/pexels-photo-1370750.jpeg',
    },
    user: {
      nickName: '바흐흑',
      profileImg:
        'https://images.pexels.com/photos/7095506/pexels-photo-7095506.jpeg',
    },
  },
  {
    id: 'post003',
    userId: 'user003',
    title: '',
    content:
      '전 어릴때부터 바이올린을 켜서 그런지 현악기 클래식만 듣게 되더라구요.. 다들 그런가요?',
    mediaType: 'none',
    createdAgo: 0,
    likeCount: 7,
    commentCount: 18,
    tags: [],
    user: {
      nickName: '줄타기선수',
      profileImg:
        'https://images.pexels.com/photos/963111/pexels-photo-963111.jpeg',
    },
  },
  {
    id: 'post004',
    userId: 'user004',
    title: '',
    content:
      '다음달에 쇼팽 콩쿠르 있어서 저 거기 가려고 비행기표 예약했음.. 임윤찬 피아니스트 제발 1등하길 빌고 있어요.',
    mediaType: 'youtube',
    mediaUrl: 'https://youtu.be/-8RV2S2PGHg?si=etS-WJzWNcN571I5',
    createdAgo: 12,
    likeCount: 156,
    commentCount: 47,
    tags: ['임윤찬', '쇼팽_콩쿠르'],
    bestComment: {
      userId: 'user888',
      content:
        '임윤찬 정말 대단한 피아니스트에요! 저도 응원합니다. 현장에서 보시다니 정말 부럽네요ㅠㅠ',
      profileImg:
        'https://images.pexels.com/photos/164935/pexels-photo-164935.jpeg',
    },
    user: {
      nickName: '윤찬아사랑해',
      profileImg:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Yunchan_Lim_Sofrolimsky.jpg/250px-Yunchan_Lim_Sofrolimsky.jpg',
    },
  },
  {
    id: 'post005',
    userId: 'user005',
    title: '',
    content:
      '바로크 시대 작곡가들의 클래식을 모아놓은 곡이 있길래 듣고 있었는데, 3번째 곡의 제목을 모르겠어서 가져와봤습니다.. 혹시 아시는분?',
    mediaType: 'youtube',
    mediaUrl: 'https://youtu.be/ZW6rstVdfFw?si=wTduM0UeTuSSejpF',
    createdAgo: 48,
    likeCount: 15,
    commentCount: 23,
    tags: ['바로크시대', '궁금합니다'],
    user: {
      nickName: '오늘뭐듣지',
      profileImg:
        'https://images.pexels.com/photos/3394666/pexels-photo-3394666.jpeg',
    },
  },
];

// 더미 댓글 데이터
export const mockComments: Comment[] = [
  {
    id: 'comment001',
    userId: 'user101',
    userName: '멋쟁이',
    userProfileImg:
      'https://images.pexels.com/photos/164821/pexels-photo-164821.jpeg',
    content: '덕분에 좋은 곡 들어요! 감사합니다.',
    createdAgo: 48,
    likeCount: 3,
    commentCount: 0,
  },
  {
    id: 'comment002',
    userId: 'user102',
    userName: '효정',
    userProfileImg:
      'https://images.pexels.com/photos/2948636/pexels-photo-2948636.jpeg',
    content: '바흐 노래에 이런것도 있는줄 몰랐어요.',
    createdAgo: 24,
    likeCount: 5,
    commentCount: 0,
  },
  {
    id: 'comment003',
    userId: 'user103',
    userName: '클래식러버',
    userProfileImg:
      'https://images.pexels.com/photos/164935/pexels-photo-164935.jpeg',
    content: '전 플룻 배웠는데 오히려 피아노가 좋아요.',
    createdAgo: 18,
    likeCount: 2,
    commentCount: 0,
  },
  {
    id: 'comment004',
    userId: 'user104',
    userName: '말차르트',
    userProfileImg:
      'https://images.pexels.com/photos/33146374/pexels-photo-248510.jpeg',
    content: '헉 완전 부럽다ㅠㅠ',
    createdAgo: 12,
    likeCount: 8,
    commentCount: 2,
    replies: [
      {
        id: 'reply001',
        userId: 'user105',
        userName: '클래식탐험가',
        userProfileImg:
          'https://images.pexels.com/photos/33146374/pexels-photo-33146374.jpeg',
        content: '8분즈음에 시작하는 클래식 제목도 알려주세요!',
        createdAgo: 10,
        likeCount: 1,
      },
      {
        id: 'reply002',
        userId: 'user106',
        userName: '음악선생',
        userProfileImg:
          'https://images.pexels.com/photos/164821/pexels-photo-164821.jpeg',
        content: '세레나데 3번 D장조입니다~><',
        createdAgo: 8,
        likeCount: 4,
      },
    ],
  },
  // {
  //   id: 'comment005',
  //   userId: 'user107',
  //   userName: '바로크매니아',
  //   userProfileImg:
  //     'https://images.pexels.com/photos/2948636/pexels-photo-2948636.jpeg',
  //   content: '아마 차이콥스키의 안단테 칸타빌레 같은데요?',
  //   createdAgo: 6,
  //   likeCount: 12,
  //   commentCount: 0,
  // },
  {
    id: 'comment005',
    userId: 'user108',
    userName: '감동파도',
    userProfileImg:
      'https://images.pexels.com/photos/248510/pexels-photo-248510.jpeg',
    content: '드뷔시의 아라베스크는 들으면 눈물이 날 정도로 감동적입니다.',
    createdAgo: 2,
    likeCount: 9,
    commentCount: 0,
  },
];

// YouTube 더미 데이터
export const DUMMY_YOUTUBE_VIDEOS: YouTubeVideo[] = [
  {
    id: '1',
    title: 'Debussy - Clair de Lune (Official Video)',
    channel: 'ClassicalMusicOnly',
    duration: '5:03',
    thumbnail: 'https://www.youtube.com/watch?v=CvFH_6DNRCY',
  },
  {
    id: '2',
    title: 'Claude Debussy - Arabesque No. 1',
    channel: 'Piano Video',
    duration: '4:15',
    thumbnail: 'https://www.youtube.com/watch?v=A6s49OKp6aE',
  },
  {
    id: '3',
    title: 'Debussy - La Mer (Complete)',
    channel: 'Berlin Philharmonic',
    duration: '24:32',
    thumbnail: 'https://www.youtube.com/watch?v=FOCucJw7iT8',
  },
  {
    id: '4',
    title: 'Debussy - Prelude to the Afternoon of a Faun',
    channel: 'London Symphony Orchestra',
    duration: '10:45',
    thumbnail: 'https://www.youtube.com/watch?v=9_7loz-HWUM',
  },
];
