// 사용자 관련 모든 타입 정의

export type UserDTO = {
  id: string;
  nickName: string;
  profileImg: string;
};

export type UserProfileDTO = {
  id: string;
  email?: string;
  intro?: string;
  nickName: string;
  platform: string;
  profileImg?: number;
};

export type AuthUserDTO = {
  user: UserDTO;
  accessToken: string;
  refreshToken: string;
};
