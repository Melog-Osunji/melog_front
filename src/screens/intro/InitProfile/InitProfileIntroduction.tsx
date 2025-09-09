import React, {useState} from 'react';
import {View, Text, Image, TextInput, StyleSheet} from 'react-native';
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

function InitProfileIntroduction({navigation}: InitProfileScreenProps) {
  const [nickname, setNickname] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.Titletext}>닉네임을 등록해주세요</Text>
      <View style={{gap: 40, width: '100%', alignItems: 'center'}}>
        <Image
          source={require('@/assets/icons/intro/basic_profile.png')}
          style={{
            width: 120,
            height: 120,
          }}
          resizeMode="cover"
        />
        {/* 나중에 선택된 이미지로 변경되는 로직 추가 */}

        <View style={{width: '100%'}}>
          <Text
            style={{
              marginBottom: 8,
              fontSize: 16,
              color: colors.BLACK,
              fontWeight: 'bold',
            }}>
            닉네임
          </Text>
          <View style={{position: 'relative'}}>
            <TextInput
              value={nickname}
              onChangeText={setNickname}
              style={[styles.inputbar]}
            />
            {nickname === '' && (
              <Text
                style={{
                  position: 'absolute',
                  left: 12,
                  top: 10,
                  color: colors.GRAY_400,
                  fontSize: 12,
                  zIndex: 1,
                  lineHeight: 24,
                }}>
                닉네임을 입력하세요
              </Text>
            )}
          </View>
        </View>
      </View>
      <CustomButton
        label="다음"
        onPress={() => {
          navigation.navigate(InitProfileNavigations.INIT_PROFILE_NICKNAME);
        }}
      />
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
  inputbar: {
    borderRadius: 4,
    backgroundColor: colors.GRAY_100,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.BLACK,
  },
});

export default InitProfileIntroduction;
