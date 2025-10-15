// src/api/login/ProviderApi.ts
import {SocialProvider} from '@/types';
import {login as kakaoLogin} from '@react-native-seoul/kakao-login';
// import {GoogleSignin} from '@react-native-google-signin/google-signin';

export interface PlatformTokens {
  idToken?: string;
  accessToken: string;
  platform: SocialProvider;
}

export const kakaoLoginApi = async (): Promise<PlatformTokens> => {
  try {
    const kakaoResult = await kakaoLogin();
    console.log('[ProviderApi] 카카오 SDK 로그인 성공:', kakaoResult);

    return {
      idToken: kakaoResult.idToken,
      accessToken: kakaoResult.accessToken,
      platform: 'KAKAO',
    };
  } catch (error) {
    console.error('[err : 카카오 SDK 호출 실패:', error);
    throw error;
  }
};

// 이후 구현
// export const googleLoginApi = async (): Promise<PlatformTokens> => {
//   try {
//     // const googleResult = await GoogleSignin.signIn();

//     // return {
//     //   idToken: googleResult.idToken,
//     //   accessToken: googleResult.accessToken,
//     //   platform: 'GOOGLE',
//     // };

//     throw new Error('구글 로그인 미구현');
//   } catch (error) {
//     console.error('err : 구글 SDK 호출 실패:', error);
//     throw error;
//   }
// };

// export const naverLoginApi = async (): Promise<PlatformTokens> => {
//   try {
//     // 네이버 SDK 호출 로직
//     throw new Error('네이버 로그인 미구현');
//   } catch (error) {
//     console.error('err : 네이버 SDK 호출 실패:', error);
//     throw error;
//   }
// };
