import {useQueryClient} from '@tanstack/react-query';
import {searchYouTube} from '@/api/common/commonApi';
import type {YouTubeVideoParsed} from '@/types';

/*
youtube search 훅
- 사용법:
const youtubeSearch = useYoutubeSearch();
const results = await youtubeSearch('검색어');
 */
export const useYoutubeSearch = () => {
  const qc = useQueryClient();
  return (word: string) => {
    return qc
      .fetchQuery<YouTubeVideoParsed[]>({
        queryKey: ['youtube', word],
        queryFn: () => searchYouTube(word),
        staleTime: 1000 * 60 * 5, // 5분 캐시 예시
        retry: 1,
      })
      .then(res => res)
      .catch(err => {
        throw err;
      });
  };
};
