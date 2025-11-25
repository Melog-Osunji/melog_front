import instance from '../axiosInstance';
import type {BaseResponse} from '../baseResponse';

// 닉네임 중복 조회
export const checkNicknameExists = async (nickname: string) => {
  const res = await instance.get<BaseResponse<{exists: boolean}>>(
    `/api/users/nickname/exist`,
    {params: {nickname}},
  );
  return res.data.data;
};

// 사용자 팔로잉 여부 조회: GET /api/users/following/{nickname}
export const getUserFollowing = async (nickname: string) => {
  const res = await instance.get<BaseResponse<{result: boolean}>>(
    `/api/users/following/${encodeURIComponent(nickname)}`,
  );
  console.log(
    '[UserGetApi.ts] GET /api/users/following/{nickname} response:',
    res.data,
  );
  return res.data.data; // { isFollowing: boolean }
};

