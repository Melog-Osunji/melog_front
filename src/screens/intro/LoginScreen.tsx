import React from 'react';
import {View, StyleSheet, Image, ActivityIndicator, Text} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';

import {IntroStackParamList} from '@/navigations/stack/IntroStackNavigator';
import {introNavigations} from '@/constants';
import {useSocialLogin} from '@/hooks/useSocialLogin';
import {socialLoginButtons} from '@/constants/Auth';
import SocialLoginButton from '@/components/auth/SocialLoginButton';

type IntroScreenProps = StackScreenProps<
  IntroStackParamList,
  typeof introNavigations.TOS_CONSENTLIST
>;

const LoginScreen = ({navigation}: IntroScreenProps) => {
  const {isLoading, loadingProvider, handleSocialLogin} = useSocialLogin();

  const onSocialLogin = async (provider: 'kakao' | 'google' | 'naver') => {
    const success = await handleSocialLogin(provider);
    if (success) {
      navigation.navigate(introNavigations.TOS_CONSENTLIST);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/common/bg_nonedetail.png')}
        style={StyleSheet.absoluteFillObject}
      />

      <Image
        source={require('@/assets/common/app_name.png')}
        style={styles.appLogo}
      />

      {/* 글로벌 로딩 오버레이 */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ffffffff" />
          <Text style={styles.loadingText}>로그인 중...</Text>
        </View>
      )}

      {/* 소셜 로그인 버튼들 */}
      <View style={styles.buttonContainer}>
        {socialLoginButtons.map(button => (
          <SocialLoginButton
            key={button.key}
            button={button}
            onPress={onSocialLogin}
            isLoading={isLoading}
            isCurrentLoading={loadingProvider === button.key}
          />
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
  appLogo: {
    width: 170,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 120,
  },
  buttonContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    color: '#ffffffff',
    fontSize: 16,
    marginTop: 10,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
