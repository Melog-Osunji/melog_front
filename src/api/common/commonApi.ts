import api from '@/api/axiosInstance';
import type {YouTubeVideoParsed} from '@/types';

/*
유튜브 검색 (서버 프록시)
 요청: GET /api/youtube/search?word=검색어&items=갯수
 items는 기본 5
 */
export const searchYouTube = async (
  word: string,
  items = 5,
): Promise<YouTubeVideoParsed[]> => {
  try {
    const res = await api.get<YouTubeVideoParsed[]>('/api/youtube/search', {
      params: {
        word,
        items,
      },
    });
    return res.data;
  } catch (err) {
    throw err;
  }
};
