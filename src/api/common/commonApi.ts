import {BASE_URL} from '../axiosInstance';
import {getAccessToken} from '@/utils/storage/UserStorage';
import type {BaseResponse} from '../baseResponse';
import type {PickedImage} from '@/types';

// 이미지 업로드
export type ImageUploadType = 'profile' | 'post';

export const uploadImage = async (
  type: ImageUploadType = 'post',
  file: PickedImage,
): Promise<BaseResponse<string>> => {
  const path = type === 'profile' ? '/api/images/profile' : '/api/images/post';
  const fullUrl = `${BASE_URL}${path}`;
  const token = await getAccessToken();

  const form = new FormData();
  form.append('file', {
    uri: file.uri,
    name: file.name ?? `img_${Date.now()}.jpg`,
    type: file.type ?? 'image/jpeg',
  } as any);

  const fetchHeaders: Record<string, string> = {};
  if (token) fetchHeaders.Authorization = `Bearer ${token}`;

  const res = await fetch(fullUrl, {
    method: 'POST',
    headers: fetchHeaders,
    body: form,
  });

  return (await res.json()) as BaseResponse<string>;
};
