import instance from '../axiosInstance';
import type {BaseResponse} from '../baseResponse';
import type {ProfileDTO, followingCheckDTO} from '@/types';

// 닉네임 중복 조회
export const checkNicknameExists = async (nickname: string) => {
  const res = await instance.get<BaseResponse<{exists: boolean}>>(
    `/api/users/nickname/exist`,
    {params: {nickname}},
  );
  return res.data.data;
};

// 사용자 팔로잉 여부 조회: GET /api/users/following/check
export const getUserFollowing = async (targetId: string) => {
  const res = await instance.get<BaseResponse<followingCheckDTO>>(
    `/api/users/following/check?targetId=${encodeURIComponent(targetId)}`
  );
  return res.data.data; // { isFollowing: boolean }
};

// 유저 프로필 조회
export const fetchUserProfile = async () => {
  const res = await instance.get<BaseResponse<ProfileDTO>>(
    `/api/users/profile`,
  );
  return res.data.data;
};

