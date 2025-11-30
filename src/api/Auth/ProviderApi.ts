// src/api/login/ProviderApi.ts
import {Platform, Linking} from 'react-native';
import Config from '@/config';
import {SocialProvider} from '@/types';

import axios from 'axios';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {login as kakaoLogin} from '@react-native-seoul/kakao-login';
import {authorize} from 'react-native-app-auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  clientSecret: Config.NAVER_CONSUMER_SECRET,
  redirectUrl: `${Config.NAVER_SERVICE_URL_SCHEME}://callback`,
  // redirectUrl: Config.NAVER_REDIRECT_URI,
  scopes: ['openid'],
  serviceConfiguration: {
    authorizationEndpoint: 'https://nid.naver.com/oauth2.0/authorize',
    tokenEndpoint: 'https://nid.naver.com/oauth2.0/token',
  },
};

// ------naver------
export const naverLoginApi = async (): Promise<PlatformTokens> => {
  try {
    // --- 브라우저 기반 OAuth (RN -> NAVER -> Backend callback -> App deep link) ---
    // 1) state 생성 및 저장 (CSRF 방지)
    const generateState = () => Math.random().toString(36).slice(2, 15);
    const NAVER_STATE_KEY = 'naver_oauth_state';
    const state = generateState();
    await AsyncStorage.setItem(NAVER_STATE_KEY, state);

    // 2) authorize URL 구성 (redirect_uri는 백엔드 콜백 주소)
    const backendRedirect =
      (Config as any).NAVER_REDIRECT_URI ??
      'https://api.melog.org/auth/naver/callback';
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: Config.NAVER_CONSUMER_KEY,
      redirect_uri: backendRedirect,
      state,
      // 필요한 scope가 있으면 추가 (예: 'profile')
      scope: 'profile',
    });
    const authorizeUrl = `https://nid.naver.com/oauth2.0/authorize?${params.toString()}`;
    console.log('[ProviderApi] naver authorize url:', authorizeUrl);

    // 3) 앱 딥링크를 기다리는 Promise 설정
    const appDeepPrefix = `${Config.NAVER_SERVICE_URL_SCHEME}://naver-login`; // ex: melog://naver-login
    const waitForAppRedirect = (): Promise<string> =>
      new Promise((resolve, reject) => {
        let timedOut = false;
        const timeoutMs = 2 * 60 * 1000; // 2분 타임아웃
        const timeout = setTimeout(() => {
          timedOut = true;
          cleanup();
          reject(new Error('네이버 로그인 응답 타임아웃'));
        }, timeoutMs);

        const handleUrl = async (event: {url: string}) => {
          try {
            const {url} = event;
            if (!url || timedOut) return;
            console.log('[ProviderApi] received deep link:', url);
            if (!url.startsWith(appDeepPrefix)) return;

            // 쿼리 파싱
            const q = url.split('?')[1] ?? '';
            const searchParams = new URLSearchParams(q);
            const appToken = searchParams.get('appToken') ?? undefined;
            const returnedState = searchParams.get('state') ?? undefined;

            // state 검증은 백엔드에서 처리했을 가능성이 크지만, 추가 검증 원하면 비교
            const storedState = await AsyncStorage.getItem(NAVER_STATE_KEY);
            if (returnedState && storedState && returnedState !== storedState) {
              throw new Error('state mismatch');
            }

            if (!appToken) {
              throw new Error('앱 토큰이 없습니다.');
            }

            cleanup();
            resolve(appToken);
          } catch (err) {
            cleanup();
            reject(err);
          }
        };

        const cleanup = () => {
          clearTimeout(timeout);
          try {
            // RN 버전에 따라 remove 방식이 다름
            // @ts-ignore
            Linking.removeEventListener?.('url', handleUrl);
            // addEventListener returns subscription in some RN versions
            // so also attempt to remove by subscription if present
          } catch (e) {
            // ignore
          }
        };

        // 리스너 등록
        // @ts-ignore
        Linking.addEventListener?.('url', handleUrl);

        // 앱이 처음 열렸을 때 딥링크 처리
        Linking.getInitialURL()
          .then(initialUrl => {
            if (initialUrl) {
              handleUrl({url: initialUrl});
            }
          })
          .catch(e => {
            /* ignore */
          });

        // 브라우저로 authorize URL 열기 (사용자 로그인/동의)
        Linking.openURL(authorizeUrl).catch(err => {
          cleanup();
          reject(err);
        });
      });

    // 4) 대기 후 앱 토큰을 PlatformTokens 형태로 반환
    const appToken = await waitForAppRedirect();

    // cleanup: 저장한 state 제거
    await AsyncStorage.removeItem(NAVER_STATE_KEY);

    return {
      idToken: undefined,
      accessToken: appToken,
      platform: 'NAVER',
    };
  } catch (error) {
    console.error('[ProviderApi]err : naver login flow failed:', error);
    // 이전 SDK 기반 로그인(기존 NaverLogin)로의 폴백을 유지하고 싶으면 여기에서 시도 가능
    throw error;
  }
};
