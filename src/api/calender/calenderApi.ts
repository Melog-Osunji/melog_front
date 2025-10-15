import instance from '../axiosInstance';
import type { BaseResponse } from '../baseResponse';

/** ====== Types ====== */
export type CalendarMeta = {
  year: number;
  month: number;
  page: number;
  size: number;
  alarm: boolean;
};

export type CalendarDayCell = {
  date: string;
  event: boolean;
  eventList: string[];
};

export type CalendarGrid = {
  weeks: CalendarDayCell[][];
};

export type CalendarItem = {
  id: string;
  title: string;
  category: string;
  thumbnailUrl: string | null;
  venue: string;
  startDateTime: string;
  endDateTime: string;
  dday: number;
  bookmarked: boolean;
};

export type CalendarMainDTO = {
  meta: CalendarMeta;
  calendar: CalendarGrid;
  items: CalendarItem[];
};

/** 일정/알림 저장 요청 */
export type SaveScheduleRequest = {
  eventId: string;
  eventDate: string;      // "YYYY-MM-DD"
  schedule: boolean;      // 일정 북마크 on/off
  alarm: boolean;         // 알림 on/off
  alarmTime?: string;     // "HH:mm" (alarm=true일 때 권장)
};

/** 일정/알림 저장 응답 */
export type SaveScheduleResponse = {
  eventId: string;
  eventDate: string;
  schedule: boolean;
  alarm: boolean;
  alarmTime?: string;
};

/** ====== API functions ====== */

// 캘린더 메인
export const fetchCalendarMain = async (params?: {
  year?: number;
  month?: number;
}): Promise<CalendarMainDTO> => {
  const res = await instance.get<BaseResponse<CalendarMainDTO>>(
    '/api/calendar/main',
    { params }
  );
  return res.data.data;
};

// 일정/알림 북마크 저장/취소
export const saveCalendarSchedule = async (
  payload: SaveScheduleRequest
): Promise<SaveScheduleResponse> => {
  const res = await instance.post<BaseResponse<SaveScheduleResponse>>(
    '/api/calendar/schedule',
    payload
  );
  return res.data.data;
};
