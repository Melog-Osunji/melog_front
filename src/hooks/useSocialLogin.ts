import {useState} from 'react';
import {Alert} from 'react-native';
import {kakaoLoginApi} from '@/api/login/kakaoLoginApi';
import {SocialProvider} from '@/constants/socialLogin';
// import {googleLoginApi} from '@/api/login/googleLoginApi';
// import {naverLoginApi} from '@/api/login/naverLoginApi';
import {useToast} from '@/contexts/ToastContext';

export const useSocialLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<SocialProvider | null>(
    null,
  );
  const {showToast} = useToast();

  const handleSocialLogin = async (
    provider: SocialProvider,
  ): Promise<boolean> => {
    try {
      console.log(`${provider} 로그인 시작`);
      setIsLoading(true);
      setLoadingProvider(provider);

      let result;

      switch (provider) {
        case 'kakao':
          result = await kakaoLoginApi();
          break;
        case 'google':
          // result = await googleLoginApi();
          console.log('구글 로그인 준비 중...');
          throw new Error('구글 로그인이 준비 중입니다.');
        case 'naver':
          // result = await naverLoginApi();
          console.log('네이버 로그인 준비 중...');
          throw new Error('네이버 로그인이 준비 중입니다.');
        default:
          throw new Error('지원하지 않는 로그인 방식입니다.');
      }

      console.log(`✅ ${provider} 로그인 성공:`, result);
      return true;
    } catch (error) {
      console.error(`❌ ${provider} 로그인 실패:`, error);
      showToast(
        `${getProviderName(provider)} 로그인에 실패했습니다`,
        'error',
        3000,
      );
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
