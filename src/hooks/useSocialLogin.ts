import {useState} from 'react';
import {kakaoLoginApi} from '@/api/login/SocialLoginApi';
// import {googleLoginApi} from '@/api/login/googleLoginApi';
// import {naverLoginApi} from '@/api/login/naverLoginApi';
import {SocialProvider} from '@/constants/socialLogin';
import {useToast} from '@/contexts/ToastContext';
import {useAuthContext} from '@/contexts/AuthContext';

// API 매핑 객체
const socialLoginAPIs = {
  kakao: kakaoLoginApi,
  google: async () => ({success: false, user: null}), // TODO: 구현 필요
  naver: async () => ({success: false, user: null}), // TODO: 구현 필요
} as const;

export const useSocialLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<SocialProvider | null>(
    null,
  );
  const {showToast} = useToast();
  const {login} = useAuthContext();

  const handleSocialLogin = async (
    provider: SocialProvider,
  ): Promise<boolean> => {
    try {
      console.log(`[useSocialLogin] ${provider} 로그인 시작`);
      setIsLoading(true);
      setLoadingProvider(provider);

      // 공통 로그인 처리
      const loginAPI = socialLoginAPIs[provider];
      if (!loginAPI) {
        throw new Error(`${provider} 로그인 API를 찾을 수 없습니다.`);
      }

      const result = await loginAPI();

      // 로그인 성공 시 AuthContext 업데이트
      if (result.success && result.user) {
        login(result.user);
        showToast(`${getProviderName(provider)} 로그인 성공`, 'success', 2000);
      }

      console.log(`${provider} 로그인 성공:`, result);
      return true;
    } catch (error) {
      console.error(`❌ ${provider} 로그인 실패:`, error);

      // 에러 메시지 처리
      const errorMessage =
        error instanceof Error ? error.message : '로그인에 실패했습니다';
      showToast(`${getProviderName(provider)} ${errorMessage}`, 'error', 3000);
      return false;
    } finally {
      setIsLoading(false);
      setLoadingProvider(null);
    }
  };

  const getProviderName = (provider: SocialProvider): string => {
    const names = {
      kakao: '카카오',
      google: '구글',
      naver: '네이버',
    };
    return names[provider];
  };

  return {
    isLoading,
    loadingProvider,
    handleSocialLogin,
    getProviderName,
  };
};
