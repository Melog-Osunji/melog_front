// src/api/login/ProviderApi.ts
import {Platform} from 'react-native';
import Config from '@/config';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {SocialProvider} from '@/types';
import {login as kakaoLogin} from '@react-native-seoul/kakao-login';

export interface PlatformTokens {
  idToken?: string;
  accessToken: string;
  platform: SocialProvider;
}

// ------kakao------
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
    console.error('[ProviderApi]err : 카카오 SDK 호출 실패:', error);
    throw error;
  }
};

// ------google------
export const googleLoginApi = async (): Promise<PlatformTokens> => {
  try {
    // configure
    if (Platform.OS === 'ios') {
      GoogleSignin.configure({
        iosClientId: Config.GOOGLE_IOS_CLIENT_ID,
        webClientId: Config.GOOGLE_CLIENT_ID,
        offlineAccess: true,
      });
    } else {
      console.log(
        '-------[ProviderApi] GoogleSignin configure 시작:GOOGLE_IOS_CLIENT_ID=',
        Config.GOOGLE_CLIENT_ID,
      );
      GoogleSignin.configure({
        webClientId: Config.GOOGLE_CLIENT_ID,
        offlineAccess: true,
      });
    }

    await GoogleSignin.hasPlayServices();
    console.log('[ProviderApi] Google Play Services 사용 ');
    const userInfo = await GoogleSignin.signIn();
    console.log('userInfo=', userInfo);
    console.log('serverAuthCode=', userInfo.data.serverAuthCode);
    const res = await fetch('https://www.googleapis.com/oauth2/v3/token', {
      method: 'POST',
      body: JSON.stringify({
        code: userInfo.data.serverAuthCode,
        clientId: Config.GOOGLE_CLIENT_ID,
        clientSecret: Config.GOOGLE_CLIENT_SECRET,
        grant_type: 'authorization_code',
      }),
    });
    const GoogleResult = await res.json();

    if (GoogleResult.error) {
      console.error('[ProviderApi] 구글 로그인 에러:', GoogleResult);
      throw new Error(
        `[Google Login Error] ${GoogleResult.error}: ${
          GoogleResult.error_description || ''
        }`,
      );
    }

    console.log('[ProviderApi] 구글 로그인 성공:', GoogleResult);

    return {
      idToken: GoogleResult.id_token,
      accessToken: GoogleResult.access_token,
      platform: 'GOOGLE',
    };
  } catch (error) {
    console.error('[ProviderApi]err : google SDK 호출 실패:', error);
    if (typeof error === 'object' && error !== null) {
      console.log('error.code =', (error as any).code);
      console.log('error.message =', (error as any).message);
    }
    throw error;
  }
};

// export const naverLoginApi = async (): Promise<PlatformTokens> => {
//   try {
//     // 네이버 SDK 호출 로직
//     throw new Error('네이버 로그인 미구현');
//   } catch (error) {
//     console.error('err : 네이버 SDK 호출 실패:', error);
//     throw error;
//   }
// };
