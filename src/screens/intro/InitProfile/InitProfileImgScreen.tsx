import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import CustomButton from '@/components/common/CustomButton';
import {colors} from '@/constants';

import {StackScreenProps} from '@react-navigation/stack';
import {InitProfileNavigatorParamList} from '@/navigations/stack/InitProfileStackNavigator';
import {InitProfileNavigations} from '@/constants';

import type {PickedImage} from '@/types';
import {useUploadImage} from '@/hooks/queries/common/useCommonMutations';
import {showToast} from '@/components/common/ToastService';

type InitProfileScreenProps = StackScreenProps<
  InitProfileNavigatorParamList,
  typeof InitProfileNavigations.INIT_PROFILE_NICKNAME
>;

function InitProfileImgScreen({navigation}: InitProfileScreenProps) {
  const [selectedImage, setSelectedImage] = useState<PickedImage | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  // img upload mutation
  const uploadImageMutation = useUploadImage('profile');

  useEffect(() => {
    if (selectedImage) {
      console.log('[InitProfileImgScreen] 이미지 선택됨, 자동 업로드 시작');
      uploadImageMutation.mutate(selectedImage, {
        onSuccess: data => {
          console.log('[InitProfileImgScreen] 이미지 업로드 성공:', data);
          setUploadedImageUrl(data);
        },
        onError: error => {
          console.log('[InitProfileImgScreen] 이미지 업로드 실패:', error);
          showToast('이미지 업로드에 실패했습니다.', 'error');
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedImage]);

  const handleSelectImage = () => {
    launchImageLibrary({mediaType: 'photo', quality: 0.8}, response => {
      if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        setSelectedImage({
          uri: asset.uri ?? '',
          name: asset.fileName ?? `img_${Date.now()}.jpg`,
          type: asset.type ?? 'image/jpeg',
        });
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.Titletext}>프로필을 등록해주세요</Text>
      <TouchableOpacity onPress={handleSelectImage} activeOpacity={0.7}>
        {selectedImage ? (
          <Image
            source={{uri: selectedImage.uri}}
            style={{
              width: 160,
              height: 160,
              resizeMode: 'cover',
              borderRadius: 80,
            }}
          />
        ) : (
          <Image
            source={require('@/assets/icons/intro/select_img_btn.png')}
            style={{
              width: 160,
              height: 160,
              resizeMode: 'contain',
            }}
          />
        )}
      </TouchableOpacity>
      <View style={styles.buttonwrapper}>
        <CustomButton
          label="다음"
          onPress={() => {
            navigation.navigate(InitProfileNavigations.INIT_PROFILE_NICKNAME, {
              // uploadedImageUrl: 서버에 업로드 되어 사용될 URL (API 용)
              uploadedImageUrl: uploadedImageUrl ?? null,
              // selectedImage.uri: 로컬에서 화면에 보여줄 이미지 URI (화면 출력용)
              selectedImage: selectedImage?.uri ?? null,
            });
          }}
          inValid={!selectedImage}
          inValidStyle={{backgroundColor: colors.BLUE_400, opacity: 0.2}}
          style={{backgroundColor: colors.BLUE_500}}
        />
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(InitProfileNavigations.INIT_PROFILE_NICKNAME, {
              uploadedImageUrl: null,
              selectedImage: null,
            })
          }>
          <Text style={styles.text}>나중에 등록하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.WHITE,
    paddingHorizontal: 24,
    paddingVertical: 60,
  },
  Titletext: {
    fontFamily: 'NotoSansKR',
    fontSize: 22,
    color: colors.BLACK,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },
  buttonwrapper: {
    width: '100%',
    alignItems: 'center',
    gap: 15,
  },
  text: {
    color: colors.BLUE_400,
  },
});

export default InitProfileImgScreen;
