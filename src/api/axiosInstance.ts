import axios from 'axios';
import {getAccessToken} from '@/utils/tokenStorage';

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
    console.log('=== API 요청 정보 시작 ===');
    console.log('요청 URL:', `${config.baseURL}${config.url}`);
    console.log('HTTP 메소드:', config.method?.toUpperCase());

    // 로그인 관련 API는 토큰 추가하지 않음
    const isLoginAPI =
      config.url?.includes('/login/') ||
      config.url?.includes('/auth/') ||
      config.url?.includes('/register/');

    console.log('로그인 API 여부:', isLoginAPI);

    if (!isLoginAPI) {
      const token = await getAccessToken();

      console.log('토큰 상태:', {
        hasToken: !!token,
        tokenLength: token?.length,
        tokenPreview: token ? `${token.substring(0, 20)}...` : 'null',
      });

      if (token) {
        if (config.headers) {
          config.headers['Authorization'] = `Bearer ${token}`;
        } else {
          config.headers = new axios.AxiosHeaders();
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        console.log('Authorization 헤더 추가됨');
      } else {
        console.log('토큰이 미존재 - Authorization 헤더 추가 안됨');
      }
    } else {
      console.log('로그인 API - 토큰 추가하지 않음');
    }

    // 최종 헤더 정보 출력
    console.log('최종 요청 헤더:', JSON.stringify(config.headers, null, 2));

    // 요청 바디 정보 출력 (있는 경우)
    if (config.data) {
      console.log('요청 바디:', JSON.stringify(config.data, null, 2));
    } else {
      console.log('요청 바디: 없음');
    }

    // 쿼리 파라미터 출력 (있는 경우)
    if (config.params) {
      console.log('쿼리 파라미터:', JSON.stringify(config.params, null, 2));
    } else {
      console.log('쿼리 파라미터: 없음');
    }

    console.log('=== API 요청 정보 끝 ===');

    return config;
  },
  error => {
    console.error('❌ 요청 인터셉터 에러:', error);
    return Promise.reject(error);
  },
);

// 응답 인터셉터도 추가 (선택사항)
instance.interceptors.response.use(
  response => {
    console.log('=== API 응답 성공 ===');
    console.log('응답 URL:', response.config.url);
    console.log('응답 상태:', response.status, response.statusText);
    console.log('응답 전체:', JSON.stringify(response, null, 2));
    console.log('=== 응답 끝 ===');
    return response;
  },
  error => {
    console.error('❌ === API 응답 에러 ===');
    console.error('🔗 에러 URL:', error.config?.url);
    console.error(
      '에러 상태:',
      error.response?.status,
      error.response?.statusText,
    );
    console.error(
      '에러 응답 헤더:',
      JSON.stringify(error.response?.headers, null, 2),
    );
    console.error(
      '에러 응답 데이터:',
      JSON.stringify(error.response?.data, null, 2),
    );
    console.error('❌ === 에러 끝 ===');
    return Promise.reject(error);
  },
);

export default instance;
