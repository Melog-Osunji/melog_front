import instance from '../axiosInstance';
import type {BaseResponse} from '../baseResponse';

// 닉네임 중복 조회
export const checkNicknameExists = async (nickname: string) => {
  const res = await instance.get<BaseResponse<{exists: boolean}>>(
    `/api/users/nickname/exist`,
    {params: {nickname}},
  );
  return res.data.data; // { exists: boolean }
};
