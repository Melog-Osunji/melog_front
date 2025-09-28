import { useQuery } from '@tanstack/react-query';
import { fetchSearchAll, fetchSearchComposer, fetchSearchGenre, fetchSearchInstrument, fetchSearchPlayer, fetchSearchPeriod } from '@/api/search/searchApi';

export const useSearchAll = () =>
  useQuery({
    queryKey: ['search', 'all'],
    queryFn: fetchSearchAll,
    staleTime: 60 * 1000,          // 1분 동안 신선
    refetchOnMount: false,
    refetchOnWindowFocus: false,   // RN에선 보통 false
  });

export const useSearchComposer = () =>
  useQuery({
    queryKey: ['search', 'composer'],
    queryFn: fetchSearchComposer,
    staleTime: 60 * 1000,          // 1분 동안 신선
    refetchOnMount: false,
    refetchOnWindowFocus: false,   // RN에선 보통 false
});

export const useSearchGenre = () =>
  useQuery({
    queryKey: ['search', 'genre'],
    queryFn: fetchSearchGenre,
    staleTime: 60 * 1000,          // 1분 동안 신선
    refetchOnMount: false,
    refetchOnWindowFocus: false,   // RN에선 보통 false
});

export const useSearchInstrument = () =>
  useQuery({
    queryKey: ['search', 'instrument'],
    queryFn: fetchSearchInstrument,
    staleTime: 60 * 1000,          // 1분 동안 신선
    refetchOnMount: false,
    refetchOnWindowFocus: false,   // RN에선 보통 false
});

export const useSearchPerformer = () =>
  useQuery({
    queryKey: ['search', 'performer'],
    queryFn: fetchSearchPlayer,
    staleTime: 60 * 1000,          // 1분 동안 신선
    refetchOnMount: false,
    refetchOnWindowFocus: false,   // RN에선 보통 false
});

export const useSearchPeriod = () =>
  useQuery({
    queryKey: ['search', 'period'],
    queryFn: fetchSearchPeriod,
    staleTime: 60 * 1000,          // 1분 동안 신선
    refetchOnMount: false,
    refetchOnWindowFocus: false,   // RN에선 보통 false
});