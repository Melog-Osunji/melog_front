import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import {fetchMyPage} from '@/api/myPage/myPageApi';

export const MY_PAGE_QK = ['myPage'] as const;

export const useMyPage = () =>
  useQuery({
    queryKey: MY_PAGE_QK,
    queryFn: fetchMyPage,
    staleTime: 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
//     enabled: !!isLogin
    enabled: true,
  });