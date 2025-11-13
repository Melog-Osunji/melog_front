// src/hooks/queries/harmony/useHarmonyRoomGet.ts
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import {
  fetchMyHarmonyRoomAll,
  type MyHarmonyRoomListDTO,

  fetchRecentMediaAll,
  type harmonyRecentMediaDTO,

  fetchRecommendRoomsAll,
  type harmonyRecommendDTO,

  fetchHarmonyRoomPosts,
  type harmonyRoomPostsDTO,

  fetchHarmonyRoomInfo,
  type harmonyRoomInfo,

  fetchHarmonyRoomDetailInfo,
  type harmonyRoomDetailInfo,

  fetchIsMember,
  type isMemberDTO,

  fetchInsideHarmonyRoomPosts,

  fetchIsWaiting,
  type isWaitingDTO,

  fetchHarmonySearch,
  type recommendRoom
} from '@/api/harmonyRoom/harmonyRoomApi';

// -----------------------------
// Query Key 유틸 (오타 방지)
// -----------------------------
export const HarmonyQueryKeys = {
  myRooms: () => ['harmony', 'my'] as const,
  recentMedia: () => ['harmony', 'recentMedia'] as const,
  recommendRooms: () => ['harmony', 'recommendHarmony'] as const,

  roomPosts: (harmonyId: string) => ['harmony', harmonyId, 'posts'] as const,
  roomInfo: (harmonyId: string) => ['harmony', harmonyId, 'information'] as const,
  roomDetail: (harmonyId: string) => ['harmony', harmonyId, 'detail'] as const,
  isMember: (harmonyId: string) => ['harmony', harmonyId, 'isMember'] as const,

  insidePosts: (harmonyId: string) => ['harmony', harmonyId, 'insidePosts'] as const,
  search: (q: string) => ['harmony', 'search', q] as const,
};

// 공통 기본 옵션
const DEFAULTS = {
  staleTime: 60 * 1000, // 1분
  refetchOnWindowFocus: false as const,
};

// 타입 헬퍼: 옵션에서 queryKey/queryFn은 훅 내부에서 고정하므로 제외
type Opt<TData> = Omit<UseQueryOptions<TData>, 'queryKey' | 'queryFn'>;

/** 하모니룸 초입 - 나의 하모니룸 조회 */
export const useMyHarmonyRoomAll = (options?: Opt<MyHarmonyRoomListDTO>) =>
  useQuery({
    queryKey: HarmonyQueryKeys.myRooms(),
    queryFn: fetchMyHarmonyRoomAll,
    staleTime: 30 * 1000,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false
  });

/** 하모니룸 초입 - 최근 올라온 미디어 조회 */
export const useHarmonyRecentMedia = (options?: Opt<harmonyRecentMediaDTO>) =>
  useQuery({
    queryKey: HarmonyQueryKeys.recentMedia(),
    queryFn: fetchRecentMediaAll,
    staleTime: 30 * 1000,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false
  });

/** 하모니룸 초입 - 하모니룸 추천 */
export const useHarmonyRecommendRooms = (options?: Opt<harmonyRecommendDTO>) =>
  useQuery({
    queryKey: HarmonyQueryKeys.recommendRooms(),
    queryFn: fetchRecommendRoomsAll,
    staleTime: 30 * 1000,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false
  });

/** 하모니룸 정보 - 하모니룸 포스트 목록(추천/인기) */
export const useHarmonyRoomPosts = (
  harmonyId: string,
  // params?: { page?: number; size?: number; sort?: string },
  options?: Opt<harmonyRoomPostsDTO>
) =>
  useQuery({
    queryKey: HarmonyQueryKeys.roomPosts(harmonyId),
    queryFn: () => fetchHarmonyRoomPosts(harmonyId /*, params*/),
    enabled: !!harmonyId,
    ...DEFAULTS,
    ...options,
  });

/** 하모니룸 정보 - 범용 정보 */
export const useHarmonyRoomInfo = (
  harmonyId: string,
  options?: Opt<harmonyRoomInfo>
) =>
  useQuery({
    queryKey: HarmonyQueryKeys.roomInfo(harmonyId),
    queryFn: () => fetchHarmonyRoomInfo(harmonyId),
    enabled: !!harmonyId,
    ...DEFAULTS,
    ...options,
  });

/** 하모니룸 정보 - 디테일 정보 */
export const useHarmonyRoomDetailInfo = (
  harmonyId: string,
  options?: Opt<harmonyRoomDetailInfo>
) =>
  useQuery({
    queryKey: HarmonyQueryKeys.roomDetail(harmonyId),
    queryFn: () => fetchHarmonyRoomDetailInfo(harmonyId),
    enabled: !!harmonyId,
    ...DEFAULTS,
    ...options,
  });

/** 하모니룸 유저 - 멤버 여부 확인 */
export const useHarmonyIsMember = (
  harmonyId: string,
  options?: Opt<isMemberDTO>
) =>
  useQuery({
    queryKey: HarmonyQueryKeys.isMember(harmonyId),
    queryFn: () => fetchIsMember(harmonyId),
    enabled: !!harmonyId,
    ...DEFAULTS,
    ...options,
  });

/** 하모니룸 내부 피드 조회 (recommendPosts) */
export const useInsideHarmonyRoomPosts = (
  harmonyId: string,
  // params?: { page?: number; size?: number; sort?: string },
  options?: Opt<harmonyRoomPostsDTO>
) =>
  useQuery({
    queryKey: HarmonyQueryKeys.insidePosts(harmonyId),
    queryFn: () => fetchInsideHarmonyRoomPosts(harmonyId /*, params*/),
    enabled: !!harmonyId,
    ...DEFAULTS,
    ...options,
  });

/** 하모니룸 가입대기유무 */
export const useHarmonyIsWaiting = (
  harmonyId: string,
  options?: Opt<isWaitingDTO>
) =>
  useQuery({
    queryKey: HarmonyQueryKeys.insidePosts(harmonyId),
    queryFn: () => fetchIsWaiting(harmonyId),
    enabled: !!harmonyId,
    ...DEFAULTS,
    ...options,
  });

/** 하모니룸 검색 결과 */
export const useHarmonySearch = (
  q: string,
  options?: Opt<recommendRoom[]>
) =>
  useQuery({
    queryKey: HarmonyQueryKeys.search(q),
    queryFn: () => fetchHarmonySearch(q),
    enabled: !!q, // 검색어 있을 때만 실행
    ...DEFAULTS,
    ...options,
  });