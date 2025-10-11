// src/api/login/kakaoLoginApi.ts
import {login} from '@react-native-seoul/kakao-login';
import {SocialLoginResultApi} from './SocialLoginResultApi';

export const kakaoLoginApi = async () => {
  const kakaoResult = await login();

  return await SocialLoginResultApi(
    {
      idToken: kakaoResult.idToken,
      accessToken: kakaoResult.accessToken,
      platform: 'KAKAO',
    },
    '/api/auth/login/kakao',
  );
};

//이후 추가
// export const googleLoginApi = async () => {
//   const googleResult = await GoogleSignin.signIn();

//   return await socialLoginService(
//     {
//       idToken: googleResult.idToken,
//       accessToken: googleResult.accessToken,
//       platform: 'GOOGLE',
//     },
//     '/api/auth/login/google'
//   );
// };

// export const naverLoginApi = async () => {
//   const naverResult = await NaverLogin.login();

//   return await socialLoginService(
//     {
//       accessToken: naverResult.accessToken,
//       platform: 'NAVER',
//     },
//     '/api/auth/login/naver'
//   );
// };

