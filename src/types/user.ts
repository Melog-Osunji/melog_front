// 사용자 관련 모든 타입 정의
export type UserProfileDTO = {
  id: string;
  email?: string;
  intro?: string;
  nickName: string;
  platform: string;
  profileImg?: number;
};
