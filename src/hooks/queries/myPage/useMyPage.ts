import {useQuery, useQueryClient, useMutation} from '@tanstack/react-query';
import {
  updateProfile,
  fetchMyPage,
  type UpdateProfileRequest,
  type ProfileResponse,
  type MyPageDTO,
} from '@/api/myPage/myPageApi';
import {normalizePostsList} from '@/utils/mappers/postMapper';
import type {PostWithUserDTO} from '@/types/postTypes';

export const MY_PAGE_QK = ['myPage'] as const;

export const useMyPage = () =>
  useQuery({
    queryKey: MY_PAGE_QK,
    queryFn: fetchMyPage,
    staleTime: 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    select: (data: MyPageDTO) => {
      const tmp: any = data ?? {};
      const posts: PostWithUserDTO[] = normalizePostsList(data.posts ?? []);
      return {...tmp, posts};
    },
    enabled: true, // enabled: !!isLogin
  });

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<ProfileResponse, Error, UpdateProfileRequest>({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: MY_PAGE_QK});
    },
    onError: error => {
      console.error('[useUpdateProfile] 프로필 업데이트 실패:', error);
    },
  });
};
