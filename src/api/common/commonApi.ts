import instance from '../axiosInstance';
import type {BaseResponse} from '../baseResponse';
import type {PickedImage} from '@/types';

// 이미지 업로드
export type ImageUploadType = 'profile' | 'post';

export const uploadImage = async (
  ImageUploadType: ImageUploadType,
  file: PickedImage,
): Promise<BaseResponse<string>> => {
  try {
    console.log('[commonApi] uploadImage 시작', ImageUploadType);
    console.log('[commonApi] 받은 file:', file);
    const url =
      ImageUploadType === 'profile'
        ? '/api/images/profile'
        : '/api/images/upload';

    const form = new FormData();
    const name =
      file.name ?? `harmony_${Date.now()}.${file.type?.split('/')[1] || 'jpg'}`;
    const type = file.type ?? 'image/jpeg';

    form.append('file', {
      // RN FormData 규격
      uri: file.uri,
      name,
      type,
    } as any);

    console.log('[commonApi] FormData 내용:', form);
    console.log('[commonApi] file.uri :', file.uri);
    console.log('[commonApi] file.name :', name);
    console.log('[commonApi] file.type :', type);

    const res = await instance.post<BaseResponse<string>>(url, form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('[commonApi] 응답 상태:', res.status);
    console.log('[commonApi] 응답 데이터:', res.data);
    return res.data;
  } catch (error) {
    console.log('[commonApi] uploadImage 실패:', error);
    throw error;
  }
};
