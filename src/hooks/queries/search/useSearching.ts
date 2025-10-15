// hooks/queries/search/useSearching.ts
import { useQuery } from '@tanstack/react-query';
import { fetchSearching, SearchingDTO } from '@/api/search/searchApi';

export const useSearching = (q: string) =>
  useQuery<SearchingDTO>({
    queryKey: ['searching', q],
    queryFn: () => fetchSearching(q),
    enabled: q.trim().length >= 1,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,           // react-query v5
    // cacheTime: 5 * 60 * 1000,     // v4 사용 중이면 cacheTime
  });
