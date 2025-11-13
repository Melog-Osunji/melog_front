// hooks/useImagePicker.ts
import {useState} from 'react';
import {launchImageLibrary} from 'react-native-image-picker';
import type {PickedImage} from '@/types';

export const useImagePicker = () => {
  const [selectedImage, setSelectedImage] = useState<PickedImage | null>(null);

  const selectImage = () => {
    launchImageLibrary({mediaType: 'photo', quality: 0.8}, response => {
      const asset = response.assets?.[0];
      if (!asset?.uri) return;
      setSelectedImage({
        uri: asset.uri,
        name: asset.fileName ?? undefined,
        type: asset.type ?? undefined,
        isLocal: true,
      });
    });
  };

  const setServerImage = (url: string) => {
    setSelectedImage({uri: url, isLocal: false});
  };

  const resetImage = () => setSelectedImage(null);

  return {
    selectedImage, // { uri, name, type, isLocal }
    seletedImageURI: selectedImage?.uri || null,
    selectImage,
    setServerImage, // 서버 이미지 URL을 직접 지정할 때 사용
    resetImage,
  };
};
