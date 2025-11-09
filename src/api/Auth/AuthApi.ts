import instance, {axiosWithTimeout} from '../axiosInstance';
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
    data: response.data,
    tokens: {
      accessToken: accessToken.replace('Bearer ', ''),
      refreshToken,
    },
  };
}

// refreshToken으로 accessToken 재발급
export const refreshTokenApi = async (accessToken: string) => {
  console.log('[AuthApi] refreshTokenApi 요청:', accessToken);
  try {
    const res = await axiosWithTimeout(
      {
        method: 'get',
        url: '/api/auth/refresh',
        data: {accessToken},
        withCredentials: true,
      },
      10000,
    );
    console.log('[AuthApi] refreshTokenApi 응답:', res.data);
    return res.data;
  } catch (err) {
    if (err.message === 'timeout') {
      console.log('요청 타임아웃 발생');
      // 타임아웃 처리
    } else {
      console.log(
        '[AuthApi] refreshTokenApi 에러:',
        (err as any).response?.data || (err as Error).message,
      );
      // 기타 에러 처리
    }
    throw err;
  }
};
