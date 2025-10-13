import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchCalendarMain,
  saveCalendarSchedule,
  type CalendarMainDTO,
  type SaveScheduleRequest,
  type SaveScheduleResponse,
} from '@/api/calender/calenderApi';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';

/** 캘린더 메인 조회 훅 */
export const useCalendarMain = (opts?: { year?: number; month?: number }) =>
  useQuery<CalendarMainDTO>({
    queryKey: ['calendar', 'main', opts?.year ?? null, opts?.month ?? null],
    queryFn: () => fetchCalendarMain(opts),
    staleTime: 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
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

/** 일정/알림 저장/취소 훅 (mutation) */
export const useSaveCalendarSchedule = () => {
  const qc = useQueryClient();
  return useMutation<SaveScheduleResponse, unknown, SaveScheduleRequest>({
    mutationFn: saveCalendarSchedule,
    onSuccess: () => {
      // 캘린더 메인 갱신
      qc.invalidateQueries({ queryKey: ['calendar', 'main'] });
    },
  });
};