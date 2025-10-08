import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchCalendarMain,
  saveCalendarSchedule,
  type CalendarMainDTO,
  type SaveScheduleRequest,
  type SaveScheduleResponse,
} from '@/api/calendar/calendarApi';

/** 캘린더 메인 조회 훅 */
export const useCalendarMain = (opts?: { year?: number; month?: number }) =>
  useQuery<CalendarMainDTO>({
    queryKey: ['calendar', 'main', opts?.year ?? null, opts?.month ?? null],
    queryFn: () => fetchCalendarMain(opts),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });

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