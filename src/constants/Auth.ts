import {ImageSourcePropType} from 'react-native';

export type SocialProvider = 'KAKAO' | 'GOOGLE' | 'NAVER';

export const getProviderName = (provider: SocialProvider): string => {
  const names = {
    KAKAO: '카카오',
    GOOGLE: '구글',
    NAVER: '네이버',
  };
  return names[provider];
};

export interface SocialLoginButton {
  key: SocialProvider;
  icon: ImageSourcePropType;
  text: string;
  backgroundColor: string;
  textColor: string;
  borderColor?: string;
  enabled: boolean;
}
export const socialLoginButtons: SocialLoginButton[] = [
  {
    key: 'GOOGLE',
    icon: require('@/assets/icons/intro/google_icon.png'),
    text: '구글로 로그인하기',
    backgroundColor: '#fff',
    textColor: '#444',
    borderColor: '#eee',
    enabled: false, // 나중에 true로 변경
  },
  {
    key: 'KAKAO',
    icon: require('@/assets/icons/intro/kakao_icon.png'),
    text: '카카오톡으로 로그인하기',
    backgroundColor: '#FEE500',
    textColor: '#191600',
    enabled: true,
  },
  {
    key: 'NAVER',
    icon: require('@/assets/icons/intro/naver_icon.png'),
    text: '네이버로 로그인하기',
    backgroundColor: '#03C75A',
    textColor: '#fff',
    enabled: false, // 나중에 true로 변경
  },
];
