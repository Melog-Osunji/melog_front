import instance from '../axiosInstance';
import type {BaseResponse} from '../baseResponse';
import type {ProfileDTO} from '@/types';
//dto
export interface GetUserFollowingDTO {
  result: boolean;
  status: 'REQUESTED' | 'UNFOLLOW';
}
// 닉네임 중복 조회
export const checkNicknameExists = async (nickname: string) => {
  const res = await instance.get<BaseResponse<{exists: boolean}>>(
    `/api/users/nickname/exist`,
    {params: {nickname}},
  );
  return res.data.data;
};

// 사용자 팔로잉 여부 조회: GET /api/users/following/{nickname}
export const getUserFollowing = async (id: string) => {
  const res = await instance.get<BaseResponse<GetUserFollowingDTO>>(
    `/api/users/following/check`,
    {params: {targetId: id}},
  );
  return res.data.data;
};

// 유저 프로필 조회
export const fetchUserProfile = async () => {
  const res = await instance.get<BaseResponse<ProfileDTO>>(
    `/api/users/profile`,
  );
  return res.data.data;
};

// 회원 탈퇴
export const resignUser = async () => {
  const res = await instance.post<BaseResponse<null>>(`/api/resignation`);
  return res.data.data;
};
