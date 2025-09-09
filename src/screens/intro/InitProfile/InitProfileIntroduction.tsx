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
  const [inrtoduction, setInrtoduction] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.Titletext}>간단한 자기소개를 해주세요.</Text>
      <View
        style={{
          gap: 20,
          width: '100%',
          alignItems: 'center',
          marginBottom: 60,
        }}>
        <Image
          source={require('@/assets/icons/intro/basic_profile.png')}
          style={{
            width: 120,
            height: 120,
            marginBottom: 20,
          }}
          resizeMode="cover"
        />
        {/* 나중에 선택된 이미지로 변경되는 로직 추가 */}

        {/* 닉네임 */}
        <View style={{width: '100%', gap: 12}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: 8,
            }}>
            <Text style={styles.h2}>닉네임</Text>
            <Image
              source={require('@/assets/icons/intro/check_icon.png')}
              style={{width: 12, height: 12}}
              resizeMode="contain"
            />
          </View>
          <View style={styles.inputbar}>
            <Text style={styles.h3}>sdfsdf</Text>
          </View>
        </View>

        {/* 자기소개 */}
        <View style={{width: '100%', gap: 12}}>
          <Text style={styles.h2}>자기소개</Text>
          <View style={[styles.inputbar, {position: 'relative'}]}>
            <TextInput
              value={inrtoduction}
              onChangeText={text => {
                if (text.length <= 200) setInrtoduction(text);
              }}
              multiline
              maxLength={200}
              style={{minHeight: 100, textAlignVertical: 'top', padding: 0}}
            />
            {inrtoduction === '' && (
              <Text style={styles.placeholder_text}>자기소개를 입력하세요</Text>
            )}
            <Text
              style={{
                position: 'absolute',
                right: 12,
                bottom: 8,
                fontSize: 12,
                color: colors.GRAY_400,
              }}>
              {inrtoduction.length}/200
            </Text>
          </View>
        </View>
      </View>

      <CustomButton
        label="시작하기"
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
  h2: {
    fontSize: 16,
    color: colors.BLACK,
    fontWeight: 'bold',
  },
  h3: {
    fontSize: 15,
    color: colors.BLACK,
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
});

export default InitProfileIntroduction;
