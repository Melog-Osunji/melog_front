import instance from '../axiosInstance';
import type { BaseResponse } from '../baseResponse';

export type MyPageDTO = {
    profileImg: string;
    nickname: string;
    introduction: string;
    profileMusic: {
        youtube: string;
        title: string;
    };
    followers: number;
    followings: number;
    harmonyRooms: MyRoomDTO[];
    posts: MyPagePostDTO[];
    mediaPosts:MyPageDTO[];
};

export type MyRoomDTO = {
    roomId: number;
    roomName: string;
    manager: boolean;
    roomImg: string;
    bookmark: boolean;
};


export type MyPagePostDTO = {
    id: string;
    title: string;
    content: string;
    mediaType: string;
    mediaUrl: string;
    tags: string[];
};

export type MyPageBookmarkDTO={
    postId: string;
    title: string;
    createdAt: string;
};


export const fetchMyPage = async (): Promise<MyPageDTO> => {
  const res = await instance.get<BaseResponse<MyPageDTO>>('/api/users/myPage');
  return res.data.data;
};

export type ProfileResponse = {
    id:string;
    email: string;
    platform: string;
    nickName: string;
    profileImg: string;
    intro: string;
}

export type UpdateProfileRequest = {
    nickName?: string;
    profileImg?: string;
    intro?: string;
}

export const updateProfile = async(
    payload: UpdateProfileRequest
    ): Promise<ProfileResponse> => {
    const res = await instance.patch<ProfileResponse>(
        `/api/users/profile`,
        payload
    )
    return res.data;
}

