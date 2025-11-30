import instance from '../axiosInstance';
import type {BaseResponse} from '../baseResponse';
import type {PostWithUserDTO} from '@/types';

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
  posts: {
    results: PostWithUserDTO[];
  };
  mediaPosts: {
    results: PostWithUserDTO[];
  };
  bookmarks: {
    results: PostWithUserDTO[];
  };
};


export type MyRoomDTO = {
  roomId: number;
  roomName: string;
  manager: boolean;
  roomImg: string;
  bookmark: boolean;
};


export const fetchMyPage = async (profileUser?: string): Promise<MyPageDTO> => {
    const url = profileUser
      ? `/api/users/myPage?profileUser=${profileUser}`
      : `/api/users/myPage`;

  const res = await instance.get<BaseResponse<MyPageDTO>>(url);

  console.log(res.data.data.posts);
  return res.data.data;
};

export type ProfileResponse = {
  id: string;
  email: string;
  platform: string;
  nickName: string;
  profileImg: string;
  intro: string;
};

export type UpdateProfileRequest = {
  nickName?: string;
  profileImg?: string;
  intro?: string;
};

export const updateProfile = async (
  payload: UpdateProfileRequest,
): Promise<ProfileResponse> => {
  const res = await instance.patch<ProfileResponse>(
    `/api/users/profile`,
    payload,
  );
  return res.data;
};

// 이미지 전송
export type UploadProfileImageResponse = BaseResponse<string>;

export const uploadProfileImage = async (file: {
  uri: string;
  name?: string;
  type?: string;
}): Promise<string> => {
  const form = new FormData();
  const name =
    file.name ?? `profile_${Date.now()}.${file.type?.split('/')[1] || 'jpg'}`;
  const type = file.type ?? 'image/jpeg';

  form.append('file', {
    // RN FormData 규격
    uri: file.uri,
    name,
    type,
  } as any);

  const res = await instance.post<UploadProfileImageResponse>(
    `/api/images/profile`,
    form,
    {
      headers: {
        // boundary는 axios가 자동으로 붙입니다
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return (res.data as any).data;
};
