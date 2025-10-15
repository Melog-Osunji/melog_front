// hooks/common/useUserInfo.ts
import {useState, useEffect, useCallback} from 'react';
import {getUserInfo} from '@/utils/storage/UserStorage';
import type {ProfileDTO} from '@/types';

/**
 * 로컬 스토리지에서 사용자 정보를 조회하는 훅
 * @returns 사용자 정보, 로딩 상태, 에러 상태
 */
export const useUserInfo = () => {
  const [userInfo, setUserInfo] = useState<ProfileDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadUserInfo = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const info = await getUserInfo();

      if (info) {
        console.log('[useUserInfo] 사용자 정보 조회 성공:', info);
        setUserInfo(info);
      } else {
        console.log('[useUserInfo] 저장된 사용자 정보가 없습니다.');
        setUserInfo(null);
      }
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('사용자 정보 조회 실패'); //Error 객체로 통일
      console.error('[useUserInfo] 사용자 정보 조회 실패:', err);
      setError(error);
      setUserInfo(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserInfo();
  }, [loadUserInfo]);

  const refetch = loadUserInfo;

  return {userInfo, isLoading, error, refetch};
};
