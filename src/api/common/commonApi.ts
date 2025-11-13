import api from '@/api/axiosInstance';

/**
 * DTO for youtube search response (use local DTO instead of shared constants type)
 */
export interface YouTubeVideoDto {
  url: string;
  title: string;
  thumbnail: string;
  description: string;
}

/**
 * 유튜브 검색 (서버 프록시)
 * 요청: GET /api/youtube/search?word=검색어&items=5
 * 항상 items=5 고정
 */
export const searchYouTube = async (
  word: string,
): Promise<YouTubeVideoDto[]> => {
  const res = await api.get<YouTubeVideoDto[]>('/api/youtube/search', {
    params: {
      word,
      items: 5,
    },
  });
  return res.data;
};
