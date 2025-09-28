// src/hooks/queries/search/useSearch.ts
import { useQuery } from '@tanstack/react-query';
import { fetchSearch, SearchResponseDTO, fetchSearchProfile, SearchProfileDTO, fetchSearchFeed, SearchFeedDTO } from '@/api/search/searchResultApi';

export const useSearchResult = (q: string) =>
  useQuery<SearchResponseDTO>({
    queryKey: ['search', 'result', q],
    queryFn: () => fetchSearch(q),
    enabled: !!q, // q가 있을 때만 호출
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
});

export const useSearchFeed = (q: string) =>
  useQuery<SearchFeedDTO>({
    queryKey: ['search', 'feed', q],
    queryFn: () => fetchSearchFeed(q),
    enabled: !!q,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });

export const useSearchProfile = (q: string) =>
useQuery<SearchProfileDTO>({
  queryKey: ['search', 'profile', q],
  queryFn: () => fetchSearchProfile(q),
  enabled: !!q, // q가 있을 때만 호출
  staleTime: 60 * 1000,
  refetchOnWindowFocus: false,
});