// src/api/search/searchResultApi.ts
import instance from '../axiosInstance';
import type { BaseResponse } from '../baseResponse';

export type SearchUser = {
  id: string;
  email: string;
  platform: string;
  nickname: string;
  profileImageUrl: string;
  intro: string;
  oidc: string;
};

export type SearchPost = {
  id: string;
  user: SearchUser;
  title: string;
  content: string;
  mediaType: 'audio' | 'image' | 'youtube' | string;
  mediaUrl: string;
  tags: string[];
  createdAt: string;
  likes: any[];
  likeCount: number;
  hiddenUsers: string[];
  hiddenUserNicknames: string[];
  likedUserNicknames: string[];
};

export type SearchResultItem = {
  post: SearchPost;
  user: SearchUser;
};

export type PopularMedia = {
  userNickname: string;
  userProfileImgLink: string;
  postID: string;
  mediaURL: string;
  mediaType: 'youtube' | 'audio' | 'image' | string;
  createdAgo: number;
};

export type SearchResponseDTO = {
  results: SearchResultItem[];
  popularMedia: PopularMedia[];
};

// 프로필
export type SearchProfile = {
  userNickname: string;
  profileUrl: string;
  intro: string;
  follow: string;
}

export type SearchProfileDTO = {
  user: SearchProfile[];
}

// 피드
export type SearchFeedDTO = {
  resultsRecent: SearchResultItem[];
};

export const fetchSearch = async (q: string): Promise<SearchResponseDTO> => {
  const res = await instance.get<BaseResponse<SearchResponseDTO>>('/api/search', {
    params: { q },
  });
  return res.data.data;
};

export const fetchSearchProfile = async (q: string): Promise<SearchProfileDTO> => {
  const url = `/api/search/?q=${encodeURIComponent(q)}/profile`;
  const res = await instance.get<BaseResponse<SearchProfileDTO>>(url);
  return res.data.data;
};

export const fetchSearchFeed = async (q: string): Promise<SearchFeedDTO> => {
  const url = `/api/search/?q=${encodeURIComponent(q)}/feed`;
  const res = await instance.get<BaseResponse<SearchFeedDTO>>(url);
  return res.data.data;
};
