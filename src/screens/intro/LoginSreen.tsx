import React from 'react';
import {View, StyleSheet, Image, TouchableOpacity, Text} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';

import {IntroStackParamList} from '@/navigations/stack/IntroStackNavigator';
import {introNavigations} from '@/constants';

type IntroScreenProps = StackScreenProps<
  IntroStackParamList,
  typeof introNavigations.INTRO_WELCOME,
  typeof introNavigations.INTRO_PROFILE
>;

const LoginScreen = ({navigation}: IntroScreenProps) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/common/bg_nonedetail.png')}
        style={{
          ...StyleSheet.absoluteFillObject,
          width: '100%',
          height: '100%',
        }}
      />
      <Image
        source={require('@/assets/common/app_name.png')}
        style={{
          width: 170,
          height: 80,
          resizeMode: 'contain',
          marginBottom: 120,
        }}
      />

      {/* 소셜 로그인 버튼 */}
      <View
        style={{
          width: '100%',
          position: 'absolute',
          bottom: 50,
          alignItems: 'center',
        }}>
        {[
          {
            key: 'google',
            icon: require('@/assets/icons/login/google_icon.png'),
            text: '구글로 로그인하기',
            style: styles.google,
            textColor: '#444',
            onPress: () => {
              console.log('구글 로그인 버튼 클릭');
              navigation.navigate(introNavigations.INTRO_PROFILE);
            },
          },
          {
            key: 'kakao',
            icon: require('@/assets/icons/login/kakao_icon.png'),
            text: '카카오톡으로 로그인하기',
            style: styles.kakao,
            textColor: '#191600',
            onPress: () => {
              console.log('카카오 로그인 버튼 클릭');
            },
          },
          {
            key: 'naver',
            icon: require('@/assets/icons/login/naver_icon.png'),
            text: '네이버로 로그인하기',
            style: styles.naver,
            textColor: '#fff',
            onPress: () => {
              console.log('네이버 로그인 버튼 클릭');
            },
          },
        ].map(({key, icon, text, style, textColor, onPress}) => (
          <TouchableOpacity
            key={key}
            onPress={onPress}
            activeOpacity={0.7}
            style={[styles.button, style]}>
            <Image source={icon} style={styles.icon} />
            <Text style={[styles.buttonText, {color: textColor}]}>{text}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 32,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginBottom: 16,
    width: '85%',
  },
  google: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
  },
  kakao: {
    backgroundColor: '#FEE500',
  },
  naver: {
    backgroundColor: '#03C75A',
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: 'bold',
    fontFamily: 'NotoSansKR',
  },
});

export default LoginScreen;
