import {useQueryClient} from '@tanstack/react-query';
import {searchYouTube} from '@/api/common/commonApi';
import type {YouTubeVideoDto} from '@/api/common/commonApi';

/**
 * 임퍼러티브이면서 캐시를 활용하는 youtube search 훅
 * 사용법:
 * const youtubeSearch = useYoutubeSearch();
 * const results = await youtubeSearch('검색어');
 */
export const useYoutubeSearch = (searchTerm: string | null) => {
  const qc = useQueryClient();
  return (word: string) =>
    qc.fetchQuery<YouTubeVideoDto[]>({
      queryKey: ['youtube', word],
      queryFn: () => searchYouTube(word),
      staleTime: 1000 * 60 * 5, // 5분 캐시 예시
      retry: 1,
    });
};
