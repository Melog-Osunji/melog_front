import instance from '../axiosInstance';
import type {
  SocialLoginRequest,
  SocialLoginResult,
  SocialLoginResponse,
} from '@/types';

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

  const response = await instance.post<SocialLoginResponse>(endpoint, body);

  console.log(`[AuthApi] ${body.platform} 응답:`, response.data);
  console.log(`[AuthApi] ${body.platform} 헤더:`, response.headers);

  // 헤더에서 토큰 추출
  const accessToken = response.headers.authorization;
  const refreshToken = response.headers['x-refresh-token'];

  if (!accessToken || !refreshToken) {
    throw new Error(`${body.platform} 로그인: 서버 토큰을 받지 못했습니다.`);
  }

  return {
    data: response.data, // 실제 응답 데이터
    tokens: {
      accessToken: accessToken.replace('Bearer ', ''),
      refreshToken,
    },
  };
}
