import instance from '../axiosInstance';
import type {BaseResponse} from '../baseResponse';

// DTO
export interface UserAgreementDto {
  marketing: boolean;
}

export interface UserProfileDto {
  nickName: string;
  intro: string | null;
  profileImg: string | null;
}

export interface FollowRequestDto {
  follower: string;
}

export interface FollowResponseDto {
  userId: string;
  followingId: string;
  msg: 'follow' | 'unfollow' | string;
}

// #1) 이용약관
// POST /api/users/agreement (이용 약관 동의)
export const postUserAgreement = async (marketing: boolean) => {
  const body: UserAgreementDto = {marketing};
  try {
    const res = await instance.post<BaseResponse<any>>(
      '/api/users/agreement',
      body,
    );
    return res.data.data;
  } catch (err: any) {
    throw err;
  }
};

// PATCH /api/users/marketing (이용약관 동의 수정)
export const updateUserMarketing = async (marketing: boolean) => {
  const body: UserAgreementDto = {marketing};
  const res = await instance.patch<BaseResponse<any>>(
    '/api/users/marketing',
    body,
  );
  return res.data.data;
};

// #2) 프로필 수정
// PATCH /api/users/profile (회원 프로필 수정)
export const updateUserProfile = async (
  nickName: string,
  intro: string | null,
  profileImg: string | null,
) => {
  const body: UserProfileDto = {
    nickName,
    intro,
    profileImg,
  };
  console.log('[UserApi.ts] PATCH /api/users/profile body:', body);
  try {
    const res = await instance.patch<BaseResponse<any>>(
      '/api/users/profile',
      body,
    );
    return res.data.data;
  } catch (err: any) {
    throw err;
  }
};


// #3) 팔로우 / 언팔로우
// POST /api/users/following (유저 팔로우/언팔로우)
export const postUserFollowing = async (
  follower: string,
): Promise<FollowResponseDto> => {
  const body: FollowRequestDto = {follower};
  
  try {
    const res = await instance.post<BaseResponse<FollowResponseDto>>(
      '/api/users/following',
      body,
    );
    return res.data.data;
  } catch (err: any) {
    throw err;
  }
};
