import axios from 'axios';
import {getAccessToken} from '@/utils/storage/tokenStorage';

export const BASE_URL = 'https://melog.org';

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    Accept: '*/*',
  },
});

// 요청 전에 accessToken 자동 추가
instance.interceptors.request.use(
  async config => {
    // 로그인 관련 API는 토큰 추가하지 않음
    const OmitApi =
      config.url?.includes('/login/') ||
      config.url?.includes('/auth/') ||
      config.url?.includes('/register/');

    if (!OmitApi) {
      const token = await getAccessToken();
      if (token) {
        if (config.headers) {
          config.headers['Authorization'] = `Bearer ${token}`;
        } else {
          config.headers = new axios.AxiosHeaders();
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// 응답 인터셉터도 추가 (선택사항)
instance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    return Promise.reject(error);
  },
);

export default instance;
