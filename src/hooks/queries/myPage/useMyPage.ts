import { useQuery, type UseQueryOptions, useQueryClient, useMutation } from '@tanstack/react-query';
import { updateProfile, fetchMyPage, type UpdateProfileRequest, type ProfileResponse } from '@/api/myPage/myPageApi';


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

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<ProfileResponse, Error, UpdateProfileRequest>({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_PAGE_QK });
    },
    onError: (error) => {
      console.error('[useUpdateProfile] 프로필 업데이트 실패:', error);
    },
  });
};