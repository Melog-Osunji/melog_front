import {useQuery} from '@tanstack/react-query';
import {checkNicknameExists, getUserFollowing, fetchUserProfile} from '@/api/User/UserGetApi';

export const USE_USER_QK = {
  nicknameExists: (nick: string) => ['nicknameExists', nick] as const,
  following: (nick: string) => ['userFollowing', nick] as const,
  profile: () => ['userProfile'] as const,
};

// 닉네임 중복 조회
export const useCheckNickname = (nickname: string) => {
  return useQuery({
    queryKey: USE_USER_QK.nicknameExists(nickname),
    queryFn: () => checkNicknameExists(nickname),
    enabled: false,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
};

// 해당 유저 팔로잉 여부 조회
export const useGetUserFollowing = (targetId: string) => {
  return useQuery({
    queryKey: USE_USER_QK.following(targetId),
    queryFn: () => getUserFollowing(targetId),
    enabled: !!targetId,
    retry: false,
    staleTime: 0,
  });
};

// 유저 프로필 조회
export const useUserProfile = () => {
  return useQuery({
    queryKey: USE_USER_QK.profile(),
    queryFn: () => fetchUserProfile(),
    retry: false,
    staleTime: 1000 * 60 * 1,
  })
};
