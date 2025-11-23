import instance from '../axiosInstance';
import type { BaseResponse } from '../baseResponse';

/** ====== Types ====== */
export type CalendarBaseResponse = {
  success: boolean; // true
  code: number;     // 201
  message: string;  // "생성완료"
};
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
  eventId?: string;
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
};

export type DeleteScheduleRequest = {
    scheduleId: string;
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

// 캘린더 카테고리별 아이템
export const fetchCalendarItems = async (params: {
  category: string; // "MUSIC" | "THEATER" | "ALL" 등
}): Promise<CalendarItem[]> => {
  const res = await instance.get<BaseResponse<CalendarItem[]>>(
    '/api/calendar/items',
    { params }
  );
  return res.data.data;
};

// 일정/알림 북마크 저장
export const saveCalendarSchedule = async (
  payload: SaveScheduleRequest
): Promise<CalendarBaseResponse> => {
  const res = await instance.post<CalendarBaseResponse>(
    '/api/calendar/event/save',
    payload
  );
  return res.data;
};

// 일정/알림 북마크 삭제
export const deleteCalendarSchedule = async (
  payload: DeleteScheduleRequest
): Promise<CalendarBaseResponse> => {
  const res = await instance.delete<CalendarBaseResponse>(
    '/api/calendar/event/delete',
    {
      data: payload, // ✅ axios.delete는 body를 data로 감싸야 함
    }
  );
  return res.data;
};