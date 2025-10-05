import {ImageSourcePropType} from 'react-native';

export interface SocialLoginButton {
  key: SocialProvider;
  icon: ImageSourcePropType;
  text: string;
  backgroundColor: string;
  textColor: string;
  borderColor?: string;
  enabled: boolean;
}

export type SocialProvider = 'kakao' | 'google' | 'naver';

export const socialLoginButtons: SocialLoginButton[] = [
  {
    key: 'google',
    icon: require('@/assets/icons/intro/google_icon.png'),
    text: '구글로 로그인하기',
    backgroundColor: '#fff',
    textColor: '#444',
    borderColor: '#eee',
    enabled: false, // 나중에 true로 변경
  },
  {
    key: 'kakao',
    icon: require('@/assets/icons/intro/kakao_icon.png'),
    text: '카카오톡으로 로그인하기',
    backgroundColor: '#FEE500',
    textColor: '#191600',
    enabled: true,
  },
  {
    key: 'naver',
    icon: require('@/assets/icons/intro/naver_icon.png'),
    text: '네이버로 로그인하기',
    backgroundColor: '#03C75A',
    textColor: '#fff',
    enabled: false, // 나중에 true로 변경
  },
];
