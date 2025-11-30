// src/api/login/ProviderApi.ts
import {Platform} from 'react-native';
import Config from '@/config';
import {SocialProvider} from '@/types';

import axios from 'axios';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {login as kakaoLogin} from '@react-native-seoul/kakao-login';
import NaverLogin from '@react-native-seoul/naver-login';
import {authorize} from 'react-native-app-auth'; // naver oidc용
// import {openNaverLogin, waitForNaverAppToken} from '@/auth/naverAuth';

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

    try {
      await GoogleSignin.signOut();
      console.log(
        '[ProviderApi] Google signOut performed to force account picker',
      );
    } catch (e) {
      console.log('[ProviderApi] signOut failed (ignore):', e);
    }

    const userInfo = await GoogleSignin.signIn();
    const GoogleResult = await GoogleSignin.getTokens();
    console.log('[ProviderApi] 구글 SDK 로그인 성공:', GoogleResult);

    return {
      idToken: GoogleResult.idToken,
      accessToken: GoogleResult.accessToken,
      platform: 'GOOGLE',
    };
  } catch (error) {
    console.error('[ProviderApi]err : google SDK 호출 실패:', error);
    throw error;
  }
};

const naverOidcConfig = {
  issuer: 'https://nid.naver.com',
  clientId: Config.NAVER_CONSUMER_KEY,
  // Use the scheme configured in src/config (NAVER_SERVICE_URL_SCHEME)
  redirectUrl: `${Config.NAVER_SERVICE_URL_SCHEME}://callback`,
  scopes: ['openid', 'profile'],
  serviceConfiguration: {
    authorizationEndpoint: 'https://nid.naver.com/oauth2.0/authorize',
    tokenEndpoint: 'https://nid.naver.com/oauth2.0/token',
  },
};

// ------naver------
export const naverLoginApi = async (): Promise<PlatformTokens> => {
  try {
    // Open the authorize URL (generates state and stores it) which points to the
    // backend callback. The backend exchanges code for tokens and finally
    // redirects to the app deep link: melog://naver-login?appToken=...
    await openNaverLogin();

    // Wait for the backend to finish and redirect to the app deep link
    const appToken = await waitForNaverAppToken();

    if (!appToken) {
      throw new Error('네이버 로그인 중 응답이 없거나 시간이 초과되었습니다.');
    }

    // `appToken` is the token your backend issued (application token). We
    // return it in the PlatformTokens shape so callers can continue to send it
    // to backend login APIs if desired. Adjust callers if you prefer returning
    // the final auth result directly.
    return {
      accessToken: appToken,
      platform: 'NAVER',
    };
  } catch (error) {
    console.error('[ProviderApi]err : naver deep-link flow failed:', error);
    throw error;
  }
};
