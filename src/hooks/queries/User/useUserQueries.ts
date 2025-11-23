import {useQuery} from '@tanstack/react-query';
import {checkNicknameExists} from '@/api/User/UserGetApi';

export const USE_USER_QK = {
  nicknameExists: (nick: string) => ['nicknameExists', nick] as const,
};

export const useCheckNickname = (nickname: string) => {
  const query = useQuery({
    queryKey: USE_USER_QK.nicknameExists(nickname),
    queryFn: () => checkNicknameExists(nickname),
    enabled: false,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
  return query;
};
