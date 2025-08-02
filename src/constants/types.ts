// @/constants/types.ts

// Post
export interface User {
  profileImg: string;
  nickName: string;
}

export interface BestComment {
  userId: string;
  content: string;
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

//dummy data
export const mockPosts: Post[] = [
  {
    id: 'post001',
    userId: 'user123',
    title: '유튜브 영상 포함 포스트',
    content: '이 포스트에는 유튜브 영상이 포함되어 있습니다!',
    mediaType: 'youtube',
    mediaUrl: 'https://youtu.be/xoU55k5ZeLQ?si=VqN7aKYNoCYzjz5p',
    createdAgo: 3,
    likeCount: 45,
    commentCount: 8,
    tags: ['YouTube', 'ReactNative'],
    user: {
      nickName: '비디오매니아',
      profileImg: 'https://randomuser.me/api/portraits/women/21.jpg',
    },
  },
  {
    id: 'post002',
    userId: 'user456',
    title: '텍스트만 있는 포스트',
    content: '이건 영상 없이 텍스트만 있는 예시입니다.',
    mediaType: 'none',
    createdAgo: 5,
    likeCount: 12,
    commentCount: 0,
    tags: ['NoMedia', 'TextOnly'],
    user: {
      nickName: '조용한유저',
      profileImg: 'https://randomuser.me/api/portraits/men/33.jpg',
    },
  },
  {
    id: 'post003',
    userId: 'user123',
    title: '유튜브 영상 포함 포스트',
    content: '이 포스트에는 유튜브 영상이 포함되어 있습니다!',
    mediaType: 'youtube',
    mediaUrl: 'https://youtu.be/xoU55k5ZeLQ?si=VqN7aKYNoCYzjz5p',
    createdAgo: 3,
    likeCount: 45,
    commentCount: 8,
    tags: ['YouTube', 'ReactNative'],
    user: {
      nickName: '비디오매니아',
      profileImg: 'https://randomuser.me/api/portraits/women/21.jpg',
    },
  },
  {
    id: 'post004',
    userId: 'user456',
    title: '텍스트만 있는 포스트',
    content: '이건 영상 없이 텍스트만 있는 예시입니다.',
    mediaType: 'none',
    createdAgo: 5,
    likeCount: 12,
    commentCount: 0,
    tags: ['NoMedia', 'TextOnly'],
    user: {
      nickName: '조용한유저',
      profileImg: 'https://randomuser.me/api/portraits/men/33.jpg',
    },
  },
];

// Search
export interface PopularMedia {
    userNickname:string;
    userProfileImgLink:string;
    postID:string;
    mediaURL:string;
    mediaType:string;
    createdAgo:string;
}

// popularMedia dummy data
export const PopularMediaData: PopularMedia[] = [
    {
        userNickname:'바흐흑',
        userProfileImgLink:'https://randomuser.me/api/portraits/men/33.jpg',
        postID:'post001',
        mediaURL:'https://youtu.be/4-9gp1puvMI?si=GOa0h4oLuak7DM6I',
        mediaType:'Youtube',
        createdAgo:'7일 전',
    },
    {
        userNickname:'클래식 듣기 딱 좋은 날',
        userProfileImgLink:'https://randomuser.me/api/portraits/men/33.jpg',
        postID:'post001',
        mediaURL:'https://youtu.be/XNM8IfAxYKc?si=T5mQCRDyN6d58-XP',
        mediaType:'Youtube',
        createdAgo:'3일 전',
        }
]