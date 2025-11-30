import {useQuery} from '@tanstack/react-query';
import {getNotices, GetNoticesResponse} from '@/api/settings/settingApi';
import {checkFollowerList, checkBlockList} from '@/api/settings/settingGetApi';

// 공지사항 조회 쿼리 훅
export function useNotices() {
  return useQuery<GetNoticesResponse, Error>({
    queryKey: ['settings', 'notices'],
    queryFn: getNotices,
    staleTime: 1000 * 60 * 5, // 5분
    retry: 1,
  });
}

// 팔로잉 요청 관리 훅
export function useFollowingApply() {
  return useQuery<UserDTO[], Error>({
    queryKey: ['settings', 'following'],
    queryFn: checkFollowerList,
    staleTime: 1000 * 60, // 5분
    retry: 1,
  });
}

// 차단 관리 훅
export function useBlockList() {
  return useQuery<UserDTO[], Error>({
    queryKey: ['settings', 'block'],
    queryFn: checkBlockList,
    staleTime: 1000 * 60,
    retry: 1,
  });
}
