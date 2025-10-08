import instance from '../axiosInstance';
import type { BaseResponse } from '../baseResponse';

export type MyPageDTO = {
    profileImg: string;
    nickname: string;
    introuction: string;
    profileMusic: {
        youtube: string;
        title: string;
    };
    followers: number;
    followings: number;
    HarmonyRoom: MyRoomDTO[];
};

export type MyRoomDTO = {
    roomId: number;
    roomName: string;
    isManger: boolean;
    roomImg: string;
    BookMark: boolean;
};

export const fetchMyPage = async (): Promise<MyPageDTO> => {
  const res = await instance.get<BaseResponse<MyPageDTO>>('/api/users/myPage');
  return res.data.data;
};