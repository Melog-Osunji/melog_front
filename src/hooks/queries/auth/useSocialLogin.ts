import {useState} from 'react';
import {useMutation} from '@tanstack/react-query';
import {
  kakaoLoginApi,
  googleLoginApi,
  // naverLoginApi,
  type PlatformTokens,
} from '@/api/Auth/ProviderApi';
import {socialLogin} from '@/api/Auth/AuthApi';
import {
  setTokens,
  setUserInfo as setUserInfoStorage,
} from '@/utils/storage/UserStorage';
import {SocialProvider, SocialLoginResponse} from '@/types';
import {useAuthContext} from '@/contexts/AuthContext'; // AuthContext 추가

export const useSocialLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {login} = useAuthContext();

  // 백엔드 로그인 mutation
  const backendLoginMutation = useMutation({
    mutationFn: socialLogin,
    onSuccess: data => {
      console.log('[useSocialLogin] 백엔드 로그인 성공:', data);
    },
    onError: error => {
      console.error('[useSocialLogin] 백엔드 로그인 실패:', error);
    },
  });

  // 플랫폼별 로그인 함수 맵핑
  const platformLoginMap: Record<
    SocialProvider,
    () => Promise<PlatformTokens>
  > = {
    KAKAO: kakaoLoginApi,
    GOOGLE: googleLoginApi,
    NAVER: async () => {
      // TODO: 실제 naverLoginApi 구현 필요
      return {
        idToken: 'mock-naver-id-token',
        accessToken: 'mock-naver-access-token',
        platform: 'NAVER',
      };
    },
  };

  // 통합 소셜 로그인 함수
  const performSocialLogin = async (
    platform: SocialProvider,
  ): Promise<SocialLoginResponse> => {
    try {
      setIsLoading(true);

      // 1단계: 플랫폼 SDK에서 토큰 받기
      console.log(`[useSocialLogin] ${platform} 1단계: 플랫폼 토큰 요청`);
      const platformLoginFunction = platformLoginMap[platform];

      if (!platformLoginFunction) {
        throw new Error(`${platform} 로그인이 아직 구현되지 않았습니다.`);
      }

      const platformTokens: PlatformTokens = await platformLoginFunction();

      console.log(
        `[useSocialLogin] ${platform} 플랫폼 토큰 획득 완료`,
        platformTokens,
      );

      // 2단계: 백엔드에 토큰 전송하고 응답 받기
      console.log(`[useSocialLogin] ${platform} 2단계: 백엔드 로그인 요청`);
      const result = await backendLoginMutation.mutateAsync({
        idToken: platformTokens.idToken,
        accessToken: platformTokens.accessToken,
        platform: platformTokens.platform,
      });

      // 3단계: 토큰 및 사용자 정보 저장
      console.log(
        `[useSocialLogin] ${platform} 3단계: 토큰 및 사용자 정보 저장`,
      );

      await setTokens({
        accessToken: result.tokens.accessToken,
        refreshToken: result.tokens.refreshToken,
      });

      if (result.data.user) {
        await setUserInfoStorage(result.data.user);
        await login(result.data.user);
      }

      console.log(`[useSocialLogin] ${platform} 로그인 플로우 완료`);

      return result.data;
    } catch (error) {
      console.error(`[useSocialLogin] ${platform} 로그인 플로우 실패:`, error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // 함수
    socialLogin: performSocialLogin,

    // 상태
    isLoading: isLoading || backendLoginMutation.isPending,
    error: backendLoginMutation.error,

    // 추가 정보
    isSuccess: backendLoginMutation.isSuccess,
    data: backendLoginMutation.data,
  };
};
