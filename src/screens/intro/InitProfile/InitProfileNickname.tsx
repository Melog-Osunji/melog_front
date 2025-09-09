import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
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

function InitProfileNickname({navigation}: InitProfileScreenProps) {
  const [nickname, setNickname] = useState('');

  // 에러 조건 변수화
  const isInvalidChar =
    nickname !== '' && !/^[a-zA-Z0-9가-힣]+$/.test(nickname);
  const isTooLong = nickname.length > 10;
  const hasError = isInvalidChar || isTooLong;

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

        <View style={{width: '100%', gap: 12, marginBottom: 40}}>
          <Text
            style={{
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
              style={[
                styles.inputbar,
                hasError && {
                  borderWidth: 1,
                  borderColor: colors.ERROR_RED,
                },
              ]}
            />
            {nickname === '' && (
              <Text style={styles.placeholder_text}>닉네임을 입력하세요</Text>
            )}
            <TouchableOpacity
              style={[
                styles.duplicate_btn,
                {opacity: nickname ? 1 : 0, top: hasError ? 8 : 6},
              ]}
              activeOpacity={0.7}
              disabled={!nickname}>
              <Text style={styles.duplicate_btn_text}>중복확인</Text>
            </TouchableOpacity>
          </View>
          {isInvalidChar && (
            <Text style={styles.error_text}>
              닉네임은 한글, 영문, 숫자만 입력할 수 있어요.
            </Text>
          )}
          {isTooLong && (
            <Text style={styles.error_text}>닉네임은 10글자까지 가능해요.</Text>
          )}
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
  placeholder_text: {
    position: 'absolute',
    left: 12,
    top: 10,
    color: colors.GRAY_400,
    fontSize: 12,
    zIndex: 1,
    lineHeight: 24,
  },
  duplicate_btn: {
    position: 'absolute',
    right: 8,
    top: 8,
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: colors.GRAY_300,
    borderRadius: 50,
  },
  duplicate_btn_text: {
    color: colors.WHITE,
    fontSize: 14,
    lineHeight: 24,
  },
  error_text: {
    color: colors.ERROR_RED,
    marginLeft: 4,
  },
});

export default InitProfileNickname;
