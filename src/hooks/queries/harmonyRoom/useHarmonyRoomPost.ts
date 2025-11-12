import { useMutation, useQuery, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';

import {
  createHarmonyRoom,
  updateHarmonyRoom,
  deleteHarmonyRoom,
  requestJoinHarmonyRoom,
  leaveHarmonyRoom,
  bookmarkHarmonyRoom,
  updateHarmonyMembership,
  fetchWaitingUserList,
  uploadHarmonyImage,
  createHarmonyRoomPost,
  type HarmonyRoomBaseResponse,
  type HarmonyRoomBaseResponse2,
  type CreateHarmonyRoomRequest,
  type UpdateHarmonyRoomRequest,
  type DeleteHarmonyRoomRequest,
  type waitingUserListDTO,
} from '@/api/harmonyRoom/harmonyRoomPostApi';

// Query Key (프로젝트 키 네이밍에 맞게 조정 가능)
export const HarmonyQueryKeys = {
  list: () => ['harmony', 'list'] as const,
  my: () => ['harmony', 'my'] as const,
  bookmarks: () => ['harmony', 'bookmarks'] as const,
  recommend: () => ['harmony', 'recommendHarmony'] as const,
  recentMedia: () => ['harmony', 'recentMedia'] as const,

  detail: (harmonyId: string) => ['harmony', harmonyId, 'detail'] as const,
  info: (harmonyId: string) => ['harmony', harmonyId, 'information'] as const,
  posts: (harmonyId: string) => ['harmony', harmonyId, 'posts'] as const,
  insidePosts: (harmonyId: string) => ['harmony', harmonyId, 'insidePosts'] as const,
  isMember: (harmonyId: string) => ['harmony', harmonyId, 'isMember'] as const,
  waitingUser: (harmonyId: string) => ['harmony', harmonyId, 'waitingUser'] as const,
};

// 옵션 헬퍼
type Opt<T> = Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>;

// 1) 하모니룸 생성 (POST /api/posts/harmony)
export const useCreateHarmonyRoom = () => {
  const qc = useQueryClient();
  return useMutation<HarmonyRoomBaseResponse, Error, CreateHarmonyRoomRequest>({
    mutationFn: createHarmonyRoom,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: HarmonyQueryKeys.list() });
      qc.invalidateQueries({ queryKey: HarmonyQueryKeys.my() });
      qc.invalidateQueries({ queryKey: HarmonyQueryKeys.recommend() });
    },
  });
};

// 2) 하모니룸 수정 (PATCH /api/harmony/{id}/update)
export const useUpdateHarmonyRoom = (harmonyId: string) => {
  const qc = useQueryClient();
  return useMutation<HarmonyRoomBaseResponse, Error, UpdateHarmonyRoomRequest>({
    mutationFn: (payload) => updateHarmonyRoom(harmonyId, payload),
    onSuccess: (data) => {
      console.log('✅ updateHarmonyRoom 성공:', data);
      qc.invalidateQueries({ queryKey: HarmonyQueryKeys.detail(harmonyId) });
      qc.invalidateQueries({ queryKey: HarmonyQueryKeys.info(harmonyId) });
      qc.invalidateQueries({ queryKey: HarmonyQueryKeys.list() });
      qc.invalidateQueries({ queryKey: HarmonyQueryKeys.my() });
    },
  });
};

// 선택: 이미지 업로드만 단독으로 쓰고 싶을 때
export const useUploadHarmonyImage = (harmonyId: string) => {
  return useMutation<string, Error, { uri: string; name?: string; type?: string }>({
    mutationFn: (file) => uploadHarmonyImage(harmonyId, file),
  });
};

// 3) 하모니룸 삭제 (DELETE /api/harmony/{id}/delete)
export const useDeleteHarmonyRoom = (harmonyId: string) => {
  const qc = useQueryClient();
  return useMutation<HarmonyRoomBaseResponse, Error, DeleteHarmonyRoomRequest>({
    mutationFn: (payload) => deleteHarmonyRoom(harmonyId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: HarmonyQueryKeys.list() });
      qc.invalidateQueries({ queryKey: HarmonyQueryKeys.my() });
      qc.invalidateQueries({ queryKey: HarmonyQueryKeys.bookmarks() });
    },
  });
};

// 4) 가입 대기 유저 조회 (GET /api/harmony/{id}/waitingUser)
export const useWaitingUserList = (harmonyId: string, options?: Opt<waitingUserListDTO>) =>
  useQuery({
    queryKey: HarmonyQueryKeys.waitingUser(harmonyId),
    queryFn: () => fetchWaitingUserList(harmonyId),
    enabled: !!harmonyId,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    ...options,
    onError: (error: any) => {
          console.error('❌ [useWaitingUserList] API Error:', error.response?.data || error.message);
    },
  });

// 5) 가입 승인/거부 (PATCH /api/harmony/{id}/approve|deny)
export const useUpdateHarmonyMembership = (harmonyId: string) => {
  const qc = useQueryClient();
  return useMutation<
    HarmonyRoomBaseResponse,
    Error,
    { action: 'approve' | 'deny'; userID: string }
  >({
    mutationFn: ({ action, userID }) => updateHarmonyMembership(harmonyId, action, { userID }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: HarmonyQueryKeys.waitingUser(harmonyId) });
      qc.invalidateQueries({ queryKey: HarmonyQueryKeys.detail(harmonyId) });
      qc.invalidateQueries({ queryKey: HarmonyQueryKeys.info(harmonyId) });
    },
  });
};

// 6) 즐겨찾기 (POST /api/harmony/{id}/bookmark)
export const useBookmarkHarmonyRoom = (harmonyId: string) => {
  const qc = useQueryClient();
  return useMutation({
      // ✅ 호출 시에 harmonyId를 변수로 받는다
      mutationFn: (harmonyId: string) => bookmarkHarmonyRoom(harmonyId),
      onSuccess: (_res, harmonyId) => {
        // ✅ 관련 쿼리 싹 갱신
        qc.invalidateQueries({ queryKey: HarmonyQueryKeys.detail(harmonyId) });
        qc.invalidateQueries({ queryKey: HarmonyQueryKeys.bookmarks() });
        qc.invalidateQueries({ queryKey: HarmonyQueryKeys.my() });   // useMyHarmonyRoomAll
        qc.invalidateQueries({ queryKey: HarmonyQueryKeys.list() }); // 리스트 화면
      },
  });
};

// 7) 가입 신청 (POST /api/harmony/{id}/join)
export const useRequestJoinHarmonyRoom = (harmonyId: string) => {
  const qc = useQueryClient();
  return useMutation<HarmonyRoomBaseResponse, Error, void>({
    mutationFn: () => requestJoinHarmonyRoom(harmonyId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: HarmonyQueryKeys.isMember(harmonyId) });
      qc.invalidateQueries({ queryKey: HarmonyQueryKeys.detail(harmonyId) });
    },
  });
};

// 8) 탈퇴 (DELETE /api/harmony/{id}/leave)
export const useLeaveHarmonyRoom = (harmonyId: string) => {
  const qc = useQueryClient();
  return useMutation<HarmonyRoomBaseResponse, Error, void>({
    mutationFn: () => leaveHarmonyRoom(harmonyId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: HarmonyQueryKeys.my() });
      qc.invalidateQueries({ queryKey: HarmonyQueryKeys.list() });
      qc.invalidateQueries({ queryKey: HarmonyQueryKeys.isMember(harmonyId) });
    },
  });
};

// 9) 내부 피드 작성 (POST /api/harmony/{id}/posts)
export const useCreateHarmonyRoomPost = (harmonyId: string) => {
  const qc = useQueryClient();
  return useMutation<HarmonyRoomBaseResponse, Error, CreateHarmonyRoomPostRequest>({
    mutationFn: (payload) => createHarmonyRoomPost(harmonyId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: HarmonyQueryKeys.posts(harmonyId) });
      qc.invalidateQueries({ queryKey: HarmonyQueryKeys.insidePosts(harmonyId) });
      qc.invalidateQueries({ queryKey: HarmonyQueryKeys.detail(harmonyId) });
    },
  });
};
