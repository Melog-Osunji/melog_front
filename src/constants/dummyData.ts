import {Post, Comment, YouTubeVideo, PopularMediam, RecentHarmonyRoom, RecommendRoom} from './types';

// 더미 포스트 데이터
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
        'https://images.pexels.com/photos/3052361/pexels-photo-3052361.jpeg',
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
        'https://images.pexels.com/photos/3052361/pexels-photo-3052361.jpeg',
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
      '체르니 30번을 한번 더 읽고 있는데 이 책은 정말 마르지 않는 샘같달까요. 한번 읽을 떄마다 새로운걸 찾을 수 있는거 같아요',
    mediaType: 'youtube',
    mediaUrl: 'https://youtu.be/kL9J4Sn7W3w?si=JM0lCjnvG4TLhxVj',
    createdAgo: 5,
    likeCount: 52,
    commentCount: 8,
    tags: ['체르니', '연습곡'],
    user: {
      nickName: '피아노러버',
      profileImg:
        'https://images.pexels.com/photos/7095506/pexels-photo-7095506.jpeg',
    },
  },
  {
    id: 'post004',
    userId: 'user004',
    title: '',
    content:
      '쇼팽의 발라드 1번을 드디어 완주했습니다! 4개월 동안 연습한 보람이 있네요. 특히 코다 부분이 가장 어려웠는데, 이제 조금씩 자연스러워지고 있어요.',
    mediaType: 'youtube',
    mediaUrl: 'https://youtu.be/Ce8p0VcTbuA?si=QA4-4j-qYy5T_VcT',
    createdAgo: 1,
    likeCount: 89,
    commentCount: 15,
    tags: ['쇼팽', '발라드'],
    bestComment: {
      userId: 'user888',
      content: '발라드 1번은 정말 쇼팽의 대표작이죠! 축하드려요!',
      profileImg:
        'https://images.pexels.com/photos/3861458/pexels-photo-3861458.jpeg',
    },
    user: {
      nickName: '쇼팽러버',
      profileImg:
        'https://images.pexels.com/photos/3861458/pexels-photo-3861458.jpeg',
    },
  },
  {
    id: 'post005',
    userId: 'user005',
    title: '',
    content:
      '모차르트 피아노 소나타 K331을 연습 중인데, 1악장의 주제와 변주가 정말 아름다워요. 모차르트의 천재성을 다시 한번 느끼게 됩니다.',
    mediaType: 'youtube',
    mediaUrl: 'https://youtu.be/Xvwtp5V5WJ8?si=XJ6TF2JD4XQC1bJ9',
    createdAgo: 2,
    likeCount: 67,
    commentCount: 9,
    tags: ['모차르트', '소나타'],
    user: {
      nickName: '클래식매니아',
      profileImg:
        'https://images.pexels.com/photos/4560083/pexels-photo-4560083.jpeg',
    },
  },
  {
    id: 'post006',
    userId: 'user006',
    title: '',
    content:
      '베토벤 소나타 월광 3악장... 정말 어렵네요. 손목이 아픈데도 계속 연습하고 싶어져요. 이 중독성이 베토벤의 매력인 것 같습니다.',
    mediaType: 'youtube',
    mediaUrl: 'https://youtu.be/zucBfXpCA6s?si=ZQK-E_sV_fA4K6J8',
    createdAgo: 4,
    likeCount: 45,
    commentCount: 7,
    tags: ['베토벤', '월광'],
    user: {
      nickName: '월광연주자',
      profileImg:
        'https://images.pexels.com/photos/4560083/pexels-photo-4560083.jpeg',
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
      'https://images.pexels.com/photos/33037724/pexels-photo-33037724.jpeg',
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
      'https://images.pexels.com/photos/33148755/pexels-photo-33148755.jpeg',
    content: '드뷔시 노래에 이런것도 있는줄 몰랐어요.',
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
    content:
      '피아노 버전이 진짜 좋네요. 드뷔시의 매력을 다시 느끼게 해주셔서 감사합니다.',
    createdAgo: 18,
    likeCount: 2,
    commentCount: 0,
  },
  {
    id: 'comment004',
    userId: 'user104',
    userName: '말차르트',
    userProfileImg:
      'https://images.pexels.com/photos/164821/pexels-photo-164821.jpeg',
    content: '8분즈음에 시작하는 클래식 제목도 알려주세요!',
    createdAgo: 12,
    likeCount: 8,
    commentCount: 2,
    replies: [
      {
        id: 'reply001',
        userId: 'user105',
        userName: '클래식탐험가',
        userProfileImg:
          'https://images.pexels.com/photos/32552644/pexels-photo-32552644.jpeg',
        content: '세레나데 3번 D장조입니다~><',
        createdAgo: 10,
        likeCount: 1,
      },
      {
        id: 'reply002',
        userId: 'user106',
        userName: '말차르트',
        userProfileImg:
          'https://images.pexels.com/photos/164821/pexels-photo-164821.jpeg',
        content: '감사합니다!',
        createdAgo: 8,
        likeCount: 4,
      },
    ],
  },
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
    title: 'Best of Debussy - Classical Music Gems',
    channel: 'ClassicalMusicOnly',
    duration: '5:03',
    thumbnail: 'https://youtu.be/VRYRgA8Zbuo?si=C0YYXyR-_sZ4z0QC',
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
    title: '[조성진 Seong-Jin Cho] Debussy Clair de lune 드뷔시 달빛',
    channel: 'Berlin Philharmonic',
    duration: '24:32',
    thumbnail: 'https://youtu.be/97_VJve7UVc?si=mZKcPe7jNxPQwAUq',
  },
  {
    id: '4',
    title: 'Clair de Lune (Studio Version)',
    channel: 'London Symphony Orchestra',
    duration: '10:45',
    thumbnail: 'https://youtu.be/JGJPVl7iQUM?si=IaeNLWAF9KQoS26s',
  },
  {
    id: '5',
    title: 'What if Debussy Wrote This for Cello? Clair de Lune, Reimagined',
    channel: 'London Symphony Orchestra',
    duration: '5:28',
    thumbnail: 'https://youtu.be/TMRTJD-Ti7U?si=hpmgmhAwbo8ELjA4',
  },
];

// popularMedia 더미 데이터
export const PopularMediaData: PopularMedia[] = [
  {
    userNickname: '바흐흑',
    userProfileImgLink: 'https://randomuser.me/api/portraits/men/33.jpg',
    postID: 'post001',
    mediaURL: 'https://youtu.be/4-9gp1puvMI?si=GOa0h4oLuak7DM6I',
    mediaType: 'Youtube',
    createdAgo: '7일 전',
  },
  {
    userNickname: '클래식 듣기 딱 좋은 날',
    userProfileImgLink: 'https://randomuser.me/api/portraits/men/33.jpg',
    postID: 'post001',
    mediaURL: 'https://youtu.be/XNM8IfAxYKc?si=T5mQCRDyN6d58-XP',
    mediaType: 'Youtube',
    createdAgo: '3일 전',
  },
  {
      userNickname: '바흐흑',
      userProfileImgLink: 'https://randomuser.me/api/portraits/men/33.jpg',
      postID: 'post001',
      mediaURL: 'https://youtu.be/4-9gp1puvMI?si=GOa0h4oLuak7DM6I',
      mediaType: 'Youtube',
      createdAgo: '7일 전',
    },
    {
      userNickname: '클래식 듣기 딱 좋은 날',
      userProfileImgLink: 'https://randomuser.me/api/portraits/men/33.jpg',
      postID: 'post001',
      mediaURL: 'https://youtu.be/XNM8IfAxYKc?si=T5mQCRDyN6d58-XP',
      mediaType: 'Youtube',
      createdAgo: '3일 전',
    },
];

// RecentHarmonyRoom 더미데이터
export const RecentHarmonyRoomData: RecentHarmonyRoom[] = [
    {
        userNickname: '아이디1',
        userProfileImgLink: 'https://randomuser.me/api/portraits/men/33.jpg',
        roomID: 'room001',
        mediaURL: 'https://youtu.be/XNM8IfAxYKc?si=T5mQCRDyN6d58-XP',
        mediaType: 'Youtube',
        createdAgo: 1,
    },
    {
        userNickname: '아이디2',
        userProfileImgLink: 'https://randomuser.me/api/portraits/men/33.jpg',
        roomID: 'room002',
        mediaURL: 'https://youtu.be/4-9gp1puvMI?si=GOa0h4oLuak7DM6I',
        mediaType: 'Youtube',
        createdAgo: 8,
    },

];

// RecommendRoom 더미데이터
export const RecommendRoomData: RecommendRoom[] = [
    {
        roomID: 'room003',
        title: '하모니룸 이름1',
        tags : ['태그', '태그', '태그'],
        memberNum : 10,
        roomProfileImgLink: 'https://randomuser.me/api/portraits/men/33.jpg',
        ownerId: '아이디',
        content: '활동 내용 활동 내용 활동 내용 활동 내용 활동 내용 활동 내용 ',
        memberProfileImg: ['https://images.pexels.com/photos/32552644/pexels-photo-32552644.jpeg', 'https://images.pexels.com/photos/164821/pexels-photo-164821.jpeg'],
    },
    {
        roomID: 'room004',
        title: '하모니룸 이름2',
        tags : ['태그', '태그'],
        memberNum : 4,
        roomProfileImgLink: 'https://randomuser.me/api/portraits/men/33.jpg',
        ownerId: '아이디2',
        content: '활동 내용 활동 내용 활동 내용 활동 내용 활동 내용 활동 내용 ',
        memberProfileImg: ['https://images.pexels.com/photos/32552644/pexels-photo-32552644.jpeg', 'https://images.pexels.com/photos/164821/pexels-photo-164821.jpeg'],
    },
];
