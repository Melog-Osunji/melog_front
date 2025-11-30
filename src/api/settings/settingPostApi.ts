import instance from '../axiosInstance';
import type {BaseResponse} from '../baseResponse';

export type CreateInquiryRequest = {
  parentType: string;
  childType: string;
  title: string;
  content: string;
};

export type CreateInquiryResponse = {
  id: string;
  userId: string;
  createdAt: string;
};

export const createInquiry = async (body: CreateInquiryRequest) => {
  const res = await instance.post<BaseResponse<CreateInquiryResponse>>(
    '/api/inquiry/create',
    body,
  );
  return res.data.data;
};

// 사용자 차단
// export const blockUser = async (acceptUserId: string) => {
//   const res = await instance.post<BaseResponse<
//
// }

// 사용자 차단 해제

// 팔로워 요청 수락
