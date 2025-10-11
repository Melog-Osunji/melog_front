import axiosInstance from '../axiosInstance';
import {setTokens, setUserInfo} from '@/utils/tokenStorage';

export interface SocialLoginRequest {
  idToken?: string;
  accessToken: string;
  platform: 'KAKAO' | 'GOOGLE' | 'NAVER';
}

export interface SocialLoginResponse {
  success: boolean;
  user: {
    id: string;
    email: string;
    platform: string;
    nickName: string;
    profileImg: string;
    intro: string | null;
  };
  newUser: boolean;
}

export const socialLoginService = async (
  loginData: SocialLoginRequest,
  endpoint: string,
): Promise<SocialLoginResponse> => {
  try {
    console.log(`[socialLoginService] ${loginData.platform} 로그인 요청`);

    const response = await axiosInstance.post(endpoint, loginData);

    console.log(`[socialLoginService] ${loginData.platform} 응답:`, response);

    // 토큰 추출
    const accessToken = response.headers.authorization;
    const refreshToken = response.headers['x-refresh-token'];

    if (!accessToken || !refreshToken) {
      throw new Error('토큰을 받지 못했습니다.');
    }

    // 토큰 저장
    await setTokens({
      accessToken,
      refreshToken,
    });

    // 사용자 정보 저장
    if (response.data.user) {
      await setUserInfo(response.data.user);
    }

    console.log(`${loginData.platform} 토큰 및 사용자 정보 저장 완료`);

    return {
      success: true,
      user: response.data.user,
      newUser: response.data.newUser,
    };
  } catch (error) {
    console.error(`❌ ${loginData.platform} 로그인 실패:`, error);
    throw error;
  }
};
