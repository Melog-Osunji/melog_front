import instance from '../axiosInstance';
import type {BaseResponse} from '../baseResponse';

// 팔로워 요청 수락
export const postFollowerAllow = async (acceptUserId: string) => {
  const body: acceptUserId;
  try {
    const res = await instance.post<BaseResponse<any>>(
      '/api/settings/follower/accept',
      body,
    );
    return res.data.data;
  } catch (err: any) {
    throw err;
  }
};
