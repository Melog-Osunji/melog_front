import axios from 'axios';
import {getAccessToken} from '@/utils/tokenStorage';

export const BASE_URL = 'https://melog.org';

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json; charset=utf-8', //인코딩 해결 안됨
    Accept: '*/*',
  },
});

// 요청 전에 accessToken 자동 추가
instance.interceptors.request.use(
  async config => {
    // 로그인 관련 API는 토큰 추가하지 않음
    const isLoginAPI =
      config.url?.includes('/login/') ||
      config.url?.includes('/auth/') ||
      config.url?.includes('/register/');

    if (!isLoginAPI) {
      const token = await getAccessToken();
      if (token) {
        if (config.headers) {
          config.headers['Authorization'] = `Bearer ${token}`;
        } else {
          // Ensure headers is always an AxiosHeaders object before setting Authorization
          config.headers = new axios.AxiosHeaders();
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      }
    }

    return config;
  },
  error => Promise.reject(error),
);

export default instance;
