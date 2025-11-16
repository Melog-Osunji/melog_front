import {SocialLoginButtonType} from '@/types';

export const socialLoginButtons: SocialLoginButtonType[] = [
  {
    key: 'GOOGLE',
    icon: require('@/assets/icons/intro/google_icon.png'),
    text: '구글로 로그인하기',
    backgroundColor: '#fff',
    textColor: '#444',
    borderColor: '#eee',
    enabled: true,
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
