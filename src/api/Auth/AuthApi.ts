import {rawapi} from '../axiosInstance';
import type {
  SocialLoginRequest,
  SocialLoginResult,
  SocialLoginResponse,
} from '@/types';
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  clearAuthData,
} from '@/utils/storage/UserStorage';
import {logout} from '@/contexts/AuthContext';

const PLATFORM_ENDPOINTS = {
  KAKAO: '/api/auth/login/kakao',
  GOOGLE: '/api/auth/login/google',
  NAVER: '/api/auth/login/naver',
} as const;

export async function socialLogin(
  body: SocialLoginRequest,
): Promise<SocialLoginResult> {
  const endpoint = PLATFORM_ENDPOINTS[body.platform];

  console.log(`[AuthApi] ${body.platform} 로그인 요청:`, endpoint);

  const response = await rawapi.post<SocialLoginResponse>(endpoint, body);

  console.log(`[AuthApi] ${body.platform} 응답:`, response.data);
  console.log(`[AuthApi] ${body.platform} 헤더:`, response.headers);

  // 헤더에서 토큰 추출
  const accessToken = response.headers.authorization;
  const refreshToken = response.headers['x-refresh-token'];

  if (!accessToken || !refreshToken) {
    throw new Error(`${body.platform} 로그인: 서버 토큰을 받지 못했습니다.`);
  }

  return {
    data: response.data,
    tokens: {
      accessToken: accessToken.replace('Bearer ', ''),
      refreshToken,
    },
  };
}

/**
 토큰 리프레시 처리
 - 성공: accessToken 저장(+ refreshToken 있으면 회전 적용)
 - 실패: 세션 정리 후 throw (상위에서 잡아 처리)
 */
export async function tokenRefresh(): Promise<string> {
  const at = await getAccessToken();
  const rt = await getRefreshToken();
  if (!rt) {
    console.log('[authapi.ts] NO_REFRESH_TOKEN');
    await clearAuthData();
    logout();
    throw new Error('NO_REFRESH_TOKEN');
  }

  try {
    const res = await rawapi.post('/api/auth/refresh', null, {
      headers: {
        ...(at ? {Authorization: `Bearer ${at}`} : {}),
        'X-Refresh-Token': rt,
      },
    });

    const {accessToken, refreshToken, refreshTtlSeconds} = res.data || {};
    if (!accessToken) {
      console.log('[authapi.ts] INVALID_REFRESH_RESPONSE:', res.data);
      throw new Error('INVALID_REFRESH_RESPONSE');
    }

    await setAccessToken(accessToken);
    // 회전 정책: refreshToken 제공 시 교체
    if (refreshToken) {
      await setRefreshToken(refreshToken);
      console.log(
        '[authapi.ts] refreshToken 회전 적용. ttl(sec)=',
        refreshTtlSeconds ?? null,
      );
    }

    console.log('[authapi.ts] /api/auth/refresh 성공 (AT 갱신 완료)');
    return accessToken;
  } catch (e: any) {
    console.log(
      '[authapi.ts] /api/auth/refresh 실패:',
      e?.response?.status,
      e?.message,
    );
    await clearAuthData();
    logout();
    throw e;
  }
}
