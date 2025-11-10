// axiosInstance.ts
import axios from 'axios';
import {getAccessToken, clearAuthData} from '@/utils/storage/UserStorage';
import {logout} from '@/contexts/AuthContext';
import {tokenRefresh} from '@/api/Auth/AuthApi';

export const BASE_URL = 'https://melog.org';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {Accept: 'application/json'},
});

const OMIT = ['/auth/login', '/auth/register'];

// ======================= 요청 인터셉터 =======================
api.interceptors.request.use(async cfg => {
  const url = cfg.url ?? '';
  if (OMIT.some(p => url.includes(p))) return cfg;

  const at = await getAccessToken();
  if (at) {
    if ((cfg.headers as any)?.set) {
      (cfg.headers as any).set('Authorization', `Bearer ${at}`);
    } else if (cfg.headers) {
      (cfg.headers as any)['Authorization'] = `Bearer ${at}`;
    } else {
      cfg.headers = {Authorization: `Bearer ${at}`} as any;
    }
    console.log('[axiosInstance.ts] Authorization set');
  }
  return cfg;
});

// ======================= 401 단일-리프레시 제어 =======================
let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

// ======================= 응답 인터셉터 =======================
api.interceptors.response.use(
  res => res,
  async err => {
    const {response, config} = err || {};
    const original: any = config || {};

    // 네트워크 에러 등
    if (!response) {
      console.log('[axiosInstance.ts] 네트워크/알수없는 오류:', err?.message);
      throw err;
    }

    const url = String(original.url || '');
    const isAuthPath = OMIT.some(p => url.includes(p));

    // 401이 아니거나, auth 경로면 리프레시 대상 아님
    if (response.status !== 401 || isAuthPath) {
      // 403/405/5xx 등은 그대로 전파
      return Promise.reject(err);
    }

    // 무한 루프 방지: 재시도는 1회만
    if (original._retry) {
      console.log('[axiosInstance.ts] 재시도 후에도 401 → 세션 종료');
      await clearAuthData();
      logout();
      return Promise.reject(err);
    }
    original._retry = true;

    try {
      // 싱글-플라이트: 리프레시는 오직 1회
      if (!isRefreshing) {
        isRefreshing = true;
        console.log('[axiosInstance.ts] 리프레시 시작');
        refreshPromise = tokenRefresh().finally(() => {
          isRefreshing = false;
          refreshPromise = null;
        });
      } else {
        console.log('[axiosInstance.ts] 리프레시 진행중 → 대기');
      }

      const newAT = await (refreshPromise as Promise<string>);

      // 원요청 Authorization 갱신
      if ((original.headers as any)?.set) {
        (original.headers as any).set('Authorization', `Bearer ${newAT}`);
      } else if (original.headers) {
        (original.headers as any)['Authorization'] = `Bearer ${newAT}`;
      } else {
        original.headers = {Authorization: `Bearer ${newAT}`} as any;
      }

      console.log('[axiosInstance.ts] 리프레시 성공 → 원요청 재시도');
      return api(original);
    } catch (e) {
      // tokenRefresh 내부에서 세션 정리/로그아웃 수행됨
      console.log('[axiosInstance.ts] 리프레시 실패 → 에러 전파');
      return Promise.reject(e);
    }
  },
);

export default api;
