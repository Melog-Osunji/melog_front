// 포스트 관련 모든 타입 정의

export type PostDTO = {
  id: string;
  title: string;
  content: string;
  mediaType: string;
  mediaUrl: string;
  tags: string[];
  createdAgo: number;
  likeCount: number;
  hiddenUser: string[];
  commentCount: number;
};

export type UserDTO = {
  id: string;
  nickName: string;
  profileImg: string;
};

export type PostWithUserDTO = {
  post: PostDTO;
  user: UserDTO;
};

export type PostsDTO = {
  results: PostWithUserDTO[];
};
