import type {ImageSourcePropType} from 'react-native';
import type {ProfileDTO} from '@/types';

export type SocialProvider = 'KAKAO' | 'GOOGLE' | 'NAVER';

export const getProviderName = (provider: SocialProvider): string => {
  const names = {
    KAKAO: '카카오',
    GOOGLE: '구글',
    NAVER: '네이버',
  };
  return names[provider];
};

export interface TokenData {
  accessToken: string;
  refreshToken: string;
}

export interface SocialLoginRequest {
  idToken?: string;
  accessToken: string;
  platform: SocialProvider;
}

export interface SocialLoginResponse {
  user: ProfileDTO;
  isNewUser: boolean;
}

export interface SocialLoginResult {
  data: SocialLoginResponse;
  tokens: TokenData;
}

export interface SocialLoginButtonType {
  key: SocialProvider;
  icon: ImageSourcePropType;
  text: string;
  backgroundColor: string;
  textColor: string;
  borderColor?: string;
  enabled: boolean;
}
