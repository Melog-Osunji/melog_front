import {useQuery} from '@tanstack/react-query';
import {checkNicknameExists, getUserFollowing} from '@/api/User/UserGetApi';

export const USE_USER_QK = {
  nicknameExists: (nick: string) => ['nicknameExists', nick] as const,
  following: (nick: string) => ['userFollowing', nick] as const,
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
export const useGetUserFollowing = (nickname: string) => {
  return useQuery({
    queryKey: USE_USER_QK.following(nickname),
    queryFn: () => getUserFollowing(nickname),
    enabled: !!nickname,
    retry: false,
    staleTime: 1000 * 60 * 1,
  });
};
