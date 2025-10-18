import {useMutation} from '@tanstack/react-query';
import type {PickedImage} from '@/types';
import {uploadImage, ImageUploadType} from '@/api/common/commonApi';

export const useUploadImage = (ImageUploadType: ImageUploadType) => {
  return useMutation<string, Error, PickedImage>({
    mutationFn: async file => {
      const response = await uploadImage(ImageUploadType, file);
      return response.data;
    },
  });
};
