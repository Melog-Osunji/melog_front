import {useQuery} from '@tanstack/react-query';
import {getNotices, GetNoticesResponse} from '@/api/settings/settingApi';

export function useNotices() {
  return useQuery<GetNoticesResponse, Error>({
    queryKey: ['settings', 'notices'],
    queryFn: getNotices,
    staleTime: 1000 * 60 * 5, // 5분
    retry: 1,
  });
}
