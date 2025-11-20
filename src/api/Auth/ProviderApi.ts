// src/api/login/ProviderApi.ts
import {Platform} from 'react-native';
import Config from '@/config';
import {SocialProvider} from '@/types';

import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {login as kakaoLogin} from '@react-native-seoul/kakao-login';
import NaverLogin from '@react-native-seoul/naver-login';

// ------dto------
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
    throw error;
  }
};

// ------naver------
export const naverLoginApi = async (): Promise<PlatformTokens> => {
  try {
    // 초기화: 앱 전역에서 이미 초기화하고 있다면 중복 호출하지 않아도 됩니다.
    // Config에 네이버 키가 정의되어 있다고 가정합니다.
    if (Platform.OS === 'ios') {
      NaverLogin.initialize({
        appName: Config.NAVER_APP_NAME,
        consumerKey: Config.NAVER_CONSUMER_KEY,
        consumerSecret: Config.NAVER_CONSUMER_SECRET,
        serviceUrlSchemeIOS: Config.NAVER_SERVICE_URL_SCHEME,
        disableNaverAppAuthIOS: true,
      });
    } else {
      NaverLogin.initialize({
        appName: Config.NAVER_APP_NAME,
        consumerKey: Config.NAVER_CONSUMER_KEY,
        consumerSecret: Config.NAVER_CONSUMER_SECRET,
      });
    }

    const {successResponse, failureResponse} = await NaverLogin.login();

    if (failureResponse) {
      console.error('[ProviderApi] 네이버 로그인 실패:', failureResponse);
      throw new Error(JSON.stringify(failureResponse));
    }

    if (!successResponse || !successResponse.accessToken) {
      throw new Error('네이버 로그인 결과에 accessToken이 없습니다.');
    }

    console.log('[ProviderApi] 네이버 로그인 성공:', successResponse);

    return {
      idToken: undefined,
      accessToken: successResponse.accessToken,
      platform: 'NAVER',
    };
  } catch (error) {
    console.error('[ProviderApi]err : naver SDK 호출 실패:', error);
    throw error;
  }
};
