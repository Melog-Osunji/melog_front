import instance from '../axiosInstance';
import type {BaseResponse} from '../baseResponse';
import type {UserDTO} from '@/types'

// 팔로워 요청 관리 조회
export const  checkFollowerList = async () => {
  const res = await instance.get<BaseResponse<UserDTO[]>>(
    `/api/settings/follower`,
  );
  return res.data.data;
};

// 차단 요청 관리 조회
export const  checkBlockList = async () => {
  const res = await instance.get<BaseResponse<UserDTO[]>>(
    `/api/settings/block`,
  );
  return res.data.data;
};
