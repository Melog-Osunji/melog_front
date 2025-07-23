import axios from 'axios';
import {getAccessToken} from '@/utils/tokenStorage';

const instance = axios.create({
  baseURL: 'http://10.0.2.2:8080',
  headers: {
    'Content-Type': 'application/json; charset=utf-8', //인코딩 해결 안됨
    Accept: '*/*',
  },
});

// 요청 전에 accessToken 자동 추가
instance.interceptors.request.use(
  async config => {
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
    return config;
  },
  error => Promise.reject(error),
);

export default instance;
