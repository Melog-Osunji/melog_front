// src/api/search/searchApi.ts
import instance from '../axiosInstance';
import type { BaseResponse } from '../baseResponse';

// 검색 전
export type SearchAllDTO = {
  recommendKeyword: string[];
  livePopularSearch: string[];
  nowTime: string; // "2025.09.16 16:16:42"
};

export type SearchComposerDTO = {
  name: string[];
  imgLink: string[];
};

export type SearchPlayerDTO = {
  name: string;
  keyword: string[];
};

export type SearchGenreDTO = {
  genre: string;
  keyword: string[];
};

export type SearchPeriodDTO = {
  era: string[];
};

export type SearchInstrumentDTO = {
  instrument: string[];
  imgLink: string[];
};

export type SearchingDTO = {
  suggestions: string[];
};

export const fetchSearchAll = async (): Promise<SearchAllDTO> => {
  const res = await instance.get<BaseResponse<SearchAllDTO>>('/api/search/all');
  return res.data.data;
};

export const fetchSearchComposer = async ():Promise<SearchComposerDTO> => {
  const res = await instance.get<BaseResponse<SearchComposerDTO>>('/api/search/composer');
  return res.data.data;
}

export const fetchSearchPlayer = async ():Promise<SearchPlayerDTO[]> => {
  const res = await instance.get<BaseResponse<SearchPlayerDTO[]>>('/api/search/player');
  return res.data.data;
}

export const fetchSearchGenre = async ():Promise<SearchGenreDTO[]> => {
  const res = await instance.get<BaseResponse<SearchGenreDTO[]>>('/api/search/genre');
  return res.data.data;
}

export const fetchSearchPeriod = async ():Promise<SearchPeriodDTO> => {
  const res = await instance.get<BaseResponse<SearchPeriodDTO>>('/api/search/period');
  return res.data.data;
}

export const fetchSearchInstrument= async ():Promise<SearchInstrumentDTO> => {
  const res = await instance.get<BaseResponse<SearchInstrumentDTO>>('/api/search/instrument');
  return res.data.data;
}

export const fetchSearching= async (q:string):Promise<SearchingDTO> => {
    const res = await instance.get<BaseResponse<SearchingDTO>>('/api/search/autocomplete', {
        params: { q },
      });
    return res.data.data;
}