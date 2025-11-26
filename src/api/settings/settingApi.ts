import instance from '../axiosInstance';
import type {BaseResponse} from '../baseResponse';

export type Notice = {
  id: string;
  title: string;
  content: string;
  isImportant?: boolean;
  category?: string;
  imageUrl?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type GetNoticesResponse = {
  notices: Notice[];
  totalCount: number;
  hasMore: boolean;
};

export async function getNotices(): Promise<GetNoticesResponse> {
  const res = await instance.get<BaseResponse<GetNoticesResponse>>(
    '/api/secretMelog/notices0128',
  );
  return res.data.data;
}
