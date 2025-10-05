// src/api/login/kakaoLoginApi.ts
import instance from '../axiosInstance';
import {login} from '@react-native-seoul/kakao-login';

export async function kakaoLoginApi() {
  try {
    // 카카오 로그인
    const tok = await login();
    console.log('카카오 accessToken', tok.accessToken);
    console.log('카카오 idToken:', tok.idToken);

    const res = await instance.post('/api/login/kakao', {
      idToken: tok.idToken ?? '',
      accessToken: tok.accessToken,
      platform: 'KAKAO',
    });

    console.log('백엔드 응답:', res.data);
    return res.data;
  } catch (error) {
    console.error('카카오 로그인 API 오류:', error);
    throw error;
  }
}
