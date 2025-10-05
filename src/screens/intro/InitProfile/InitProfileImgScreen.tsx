import React, {useState} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import CustomButton from '@/components/common/CustomButton';
import {colors} from '@/constants';

import {StackScreenProps} from '@react-navigation/stack';
import {InitProfileNavigatorParamList} from '@/navigations/stack/InitProfileStackNavigator';
import {InitProfileNavigations} from '@/constants';

type InitProfileScreenProps = StackScreenProps<
  InitProfileNavigatorParamList,
  typeof InitProfileNavigations.INIT_PROFILE_NICKNAME
>;

function InitProfileImgScreen({navigation}: InitProfileScreenProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleSelectImage = () => {
    launchImageLibrary({mediaType: 'photo', quality: 0.8}, response => {
      if (response.assets && response.assets.length > 0) {
        setSelectedImage(response.assets[0].uri || null);
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.Titletext}>프로필을 등록해주세요</Text>
      <TouchableOpacity onPress={handleSelectImage} activeOpacity={0.7}>
        <Image
          source={
            selectedImage
              ? {uri: selectedImage}
              : require('@/assets/icons/intro/select_img_btn.png')
          }
          style={{
            width: 160,
            height: 160,
            resizeMode: 'contain',
          }}
        />
      </TouchableOpacity>
      <View style={styles.buttonwrapper}>
        <CustomButton
          label="다음"
          onPress={() => {
            navigation.navigate(InitProfileNavigations.INIT_PROFILE_NICKNAME);
          }}
        />
        <Text style={styles.text}>나중에 등록하기</Text>
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
