import React from 'react';
import axios, {AxiosRequestConfig} from 'axios';
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  clearAuthData,
} from '@/utils/storage/UserStorage';
import {refreshTokenApi} from '@/api/Auth/AuthApi';
import {logout} from '@/contexts/AuthContext';

export const BASE_URL = 'https://melog.org';

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10초 후 타임아웃
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    Accept: '*/*',
  },
});

// axios 요청에 timeout 직접 래핑
export function axiosWithTimeout(
  config: AxiosRequestConfig<any>,
  timeout = 100000,
) {
  return Promise.race([
    instance(config),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), timeout),
    ),
  ]);
}

let responseInterceptor: number | null = null;

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
        console.log('[Axios Interceptor] 요청에 토큰 추가:', token);

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

export function setupAxiosInterceptors() {
  if (responseInterceptor !== null) {
    instance.interceptors.response.eject(responseInterceptor);
  }
  responseInterceptor = instance.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        console.log('[Axios Interceptor] originalRequest:', originalRequest);
        try {
          const refreshToken = await getRefreshToken();
          if (!refreshToken) {
            await clearAuthData();
            logout();
            return Promise.reject(error);
          }
          const res = await refreshTokenApi(refreshToken);
          const newAccessToken = res.data.accessToken;
          if (!newAccessToken) {
            await clearAuthData();
            logout();
            return Promise.reject(error);
          }
          await setAccessToken(newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return instance(originalRequest);
        } catch (refreshError) {
          await clearAuthData();
          logout();
          return Promise.reject(refreshError);
        }
      }
      // 401이면서 이미 _retry가 true면 바로 인증정보 삭제 및 에러 반환
      if (error.response?.status === 401 && originalRequest._retry) {
        await clearAuthData();
        logout();
        return Promise.reject(error);
      }
      return Promise.reject(error);
    },
  );
}

export function removeAxiosInterceptors() {
  if (responseInterceptor !== null) {
    instance.interceptors.response.eject(responseInterceptor);
    responseInterceptor = null;
  }
}

export default instance;
