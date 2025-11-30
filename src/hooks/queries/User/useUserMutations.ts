import {useMutation, useQueryClient} from '@tanstack/react-query';
import {
  postUserAgreement,
  updateUserMarketing,
  updateUserProfile,
  postUserFollowing,
  postBlockUser,
} from '@/api/User/UserPostApi';

// #1) 이용약관
// 1) 이용약관 동의 제출
export const useAgreeToTerms = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (marketing: boolean) => postUserAgreement(marketing),
    onSuccess: () => {
      // 사용자 관련 쿼리 캐시 무효화
      queryClient.invalidateQueries({queryKey: ['user']});
      queryClient.invalidateQueries({queryKey: ['user', 'marketing']});
    },
    onError: (err: unknown) => {
      console.warn('[useUser] useAgreeToTerms 에러:', err);
    },
  });
};

// 2) 이용약관 업데이트
export const useUpdateUserMarketing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (marketing: boolean) => updateUserMarketing(marketing),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['user', 'marketing']});
      queryClient.invalidateQueries({queryKey: ['user']});
    },
    onError: (err: unknown) => {
      console.warn('[useUser] useUpdateUserMarketing 에러:', err);
    },
  });
};

// #2) 프로필 수정
// 1) 사용자 프로필 정보 업데이트
export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      nickName: string;
      intro?: string | null;
      profileImg?: string | null;
    }) =>
      updateUserProfile(
        payload.nickName,
        payload.intro ?? null,
        payload.profileImg ?? null,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['user']});
      queryClient.invalidateQueries({queryKey: ['user', 'profile']});
    },
    onError: (err: unknown) => {
      console.warn('[useUser] useUpdateUserProfile 에러:', err);
    },
  });
};

// #3) 팔로우 / 언팔로우
// 1) 팔로우 / 언팔로우 훅
export const useFollowUser = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (targetUserId: string) => postUserFollowing(targetUserId),
    onSuccess: (_data, _targetUserId) => {
      // 사용자 및 팔로잉 관련 캐시 무효화
      queryClient.invalidateQueries({queryKey: ['user']});
      queryClient.invalidateQueries({queryKey: ['user', 'following']});
      queryClient.invalidateQueries({queryKey: ['user', 'followers']});
    },
    onError: (err: unknown) => {
      console.warn('[useUser] useFollowUser 에러:', err);
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
};

// #4) 사용자 차단/차단해제
export const useBlockUser = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (targetUserId: string) => postBlockUser(targetUserId),
    onSuccess: (_data, targetUserId) => {
      // block 변경 시 관련 캐시 무효화
      queryClient.invalidateQueries({queryKey: ['user']});
      queryClient.invalidateQueries({queryKey: ['user', 'following']});
      queryClient.invalidateQueries({queryKey: ['user', 'followers']});
      // 필요하면 알림/설정 관련 캐시 무효화
      queryClient.invalidateQueries({queryKey: ['settings', 'notices']});
    },
    onError: (err: unknown) => {
      console.warn('[useUser] useBlockUser 에러:', err);
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
};
