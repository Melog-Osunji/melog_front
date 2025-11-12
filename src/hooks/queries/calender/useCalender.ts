import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchCalendarMain,
  fetchCalendarItems,
  saveCalendarSchedule,
  deleteCalendarSchedule,
  type CalendarMainDTO,
  type CalendarItem,
  type SaveScheduleRequest,
  type DeleteScheduleRequest,
  type CalendarBaseResponse,
} from '@/api/calender/calenderApi';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';

/** 캘린더 메인 조회 훅 */
export const useCalendarMain = (opts?: { year?: number; month?: number }) =>
  useQuery<CalendarMainDTO>({
    queryKey: ['calendar', 'main', opts?.year ?? null, opts?.month ?? null],
    queryFn: () => fetchCalendarMain(opts),
    staleTime: 0,               // invalidate 후 즉시 refetch 허용
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

export const buildMarkedDates = (weeks: CalendarMainDTO['calendar']['weeks']) => {
  const marked: Record<string, boolean> = {};
  weeks?.forEach(week => {
    week.forEach(cell => {
      if (cell?.event) marked[dayjs(cell.date).format('YYYY-MM-DD')] = true;
    });
  });
  return marked;
};

/**  카테고리별 아이템 조회 훅 */
export const useCalendarItems = (category: string) =>
  useQuery<CalendarItem[]>({
    queryKey: ['calendar', 'items', category],
    queryFn: () => fetchCalendarItems({ category }),
    enabled: !!category, // category가 있을 때만 호출
    staleTime: 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

/** 일정/알림 저장 훅 */
export const useSaveCalendarSchedule = () => {
  const qc = useQueryClient();
  return useMutation<CalendarBaseResponse, unknown, SaveScheduleRequest>({
    mutationFn: saveCalendarSchedule,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['calendar', 'main'] });
      qc.invalidateQueries({ queryKey: ['calendar', 'items'] });
    },
  });
};

/** 일정/알림 취소 훅 */
export const useDeleteCalendarSchedule = () => {
  const qc = useQueryClient();
  return useMutation<CalendarBaseResponse, unknown, DeleteScheduleRequest>({
    mutationFn: deleteCalendarSchedule,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['calendar', 'main'] });
      qc.invalidateQueries({ queryKey: ['calendar', 'items'] });
    },
    });
};