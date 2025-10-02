import instance from '../axiosInstance';
import type { BaseResponse } from '../baseResponse';

// 하모니룸 초입 - 나의 하모니룸 조회
export type MyHarmonyRoomListDTO = {
  myHarmony: HarmonyRoomDTO[];
  harmony: HarmonyRoomDTO[];
  bookmarkHarmony: HarmonyRoomDTO;
};

export type HarmonyRoomDTO = {
  id: string;
  profileImg: string;
  name: string;
};

export const fetchMyHarmonyRoomAll = async (): Promise<MyHarmonyRoomListDTO> => {
  const res = await instance.get<BaseResponse<MyHarmonyRoomListDTO>>('/api/harmony/my');
  return res.data.data;
};

// 하모니룸 초입 - 최근 올라온 미디어 조회
export type harmonyRoomMediaDTO = {
  userNickname: string;
  userProfileImgLink: string;
  harmonyRoomName: string;
  postID: string;
  mediaUrl: string;
  mediaType: 'youtube' | string;
  createdAgo: string;
};

export type harmonyRecentMediaDTO = {
  recentMedia: harmonyRoomMediaDTO[];
};

export const fetchRecentMediaAll = async (): Promise<harmonyRecentMediaDTO> => {
  const res = await instance.get<BaseResponse<harmonyRecentMediaDTO>>('/api/harmony/recentMedia');
  return res.data.data;
};

// 하모니룸 초입 - 하모니룸 추천
export type recommendRoom = {
  id: string;
  name: string;
  category: string[];
  profileImgLink: string;
  intro: string;
  memberNum: number;
  userProfileImgsUrl: string[];
};

export type harmonyRecommendDTO = {
  recommendedRooms: recommendRoom[];
};

export const fetchRecommendRoomsAll = async (): Promise<harmonyRecommendDTO> => {
  const res = await instance.get<BaseResponse<harmonyRecommendDTO>>('/api/harmony/recommendHarmony');
  return res.data.data;
};

// 하모니룸 정보 - 하모니룸 포스트
export type hamornyRoomPost = {
    id: string;
    title: string;
    content: string;
    mediaType: 'audio' | 'image' | 'youtube' | string;
    mediaUrl: string;
    tags: string[];
    createdAgo: number;
    likeCount: number;
    hiddenUsers: string[];
    commentCount: number;
};

export type harmonyUser = {
    id: string;
    nickName: string;
    profileImg: string;
};

export type harmonyRoomPosts = {
    post: harmonyRoomPost[];
    user: harmonyUser[];
};

export type harmonyRoomPostsDTO = {
    recommend: harmonyRoomPosts[];
    popular: harmonyRoomPosts[];
};

export const fetchHarmonyRoomPosts = async (
  harmonyId: string,
//   params?: { page?: number; size?: number; sort?: string } // 페이지네이션/정렬이 있으면 여기로
): Promise<harmonyRoomPostsDTO> => {
  const res = await instance.get<BaseResponse<harmonyRoomPostsDTO>>(
    `/api/harmony/${encodeURIComponent(harmonyId)}/posts`,
//     { params }
  );
  return res.data.data;
};

// 하모니룸 정보 - 하모니룸 범용 정보
export type harmonyRoomInfo = {
    profileImgLink:string;
    name: string;
    category: string[];
    intro: string;
    isRunning: boolean;
    isPrivate: boolean;
    createdAt: string;
    members: string[];
    owner: string;
    isDirectAssign: boolean;
};

export const fetchHarmonyRoomInfo = async (
  harmonyId: string,
): Promise<harmonyRoomInfo> => {
  const res = await instance.get<BaseResponse<harmonyRoomInfo>>(
    `/api/harmony/${encodeURIComponent(harmonyId)}/information`,
  );
  return res.data.data;
};


// 하모니룸 정보 - 하모니룸 디테일 정보
export type harmonyRoomDetailInfo = {
    profileImgLink:string;
    name: string;
    category: string[];
    intro: string;
    memberNum: number;
    ranking: number;
    countPosts: number;
    isBookmark: boolean;
    isAssign: boolean;
};

export const fetchHarmonyRoomDetailInfo = async (
  harmonyId: string,
): Promise<harmonyRoomDetailInfo> => {
  const res = await instance.get<BaseResponse<harmonyRoomDetailInfo>>(
    `/api/harmony/${encodeURIComponent(harmonyId)}/detail`,
  );
  return res.data.data;
};

// 하모니룸 유저 - 하모니룸 멤버 확인
export type isMemberDTO = {
    isMember: boolean;
};
export const fetchIsMember = async (
  harmonyId: string,
): Promise<isMemberDTO> => {
  const res = await instance.get<BaseResponse<isMemberDTO>>(
    `/api/harmony/${encodeURIComponent(harmonyId)}/isMember`,
  );
  return res.data.data;
};

// 하모니룸 내부 피드 조회
export const fetchInsideHarmonyRoomPosts = async (
  harmonyId: string,
//   params?: { page?: number; size?: number; sort?: string } // 페이지네이션/정렬이 있으면 여기로
): Promise<harmonyRoomPostsDTO> => {
  const res = await instance.get<BaseResponse<harmonyRoomPostsDTO>>(
    `/api/harmony/${encodeURIComponent(harmonyId)}/recommendPosts`,
//     { params }
  );
  return res.data.data;
};
