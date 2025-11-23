import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  ActivityIndicator,
  Text,
  Alert,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';

import {IntroStackParamList} from '@/navigations/stack/IntroStackNavigator';
import {introNavigations} from '@/constants';
import {useSocialLogin} from '@/hooks/queries/auth/useSocialLogin';
import {socialLoginButtons} from '@/constants';
import SocialLoginButton from '@/components/auth/SocialLoginButton';
import {SocialProvider} from '@/types';

type IntroScreenProps = StackScreenProps<
  IntroStackParamList,
  typeof introNavigations.TOS_CONSENTLIST
>;

const LoginScreen = ({navigation}: IntroScreenProps) => {
  const {socialLogin, isLoading} = useSocialLogin();
  const [loadingProvider, setLoadingProvider] = useState<SocialProvider | null>(
    null,
  );

  const onSocialLogin = async (provider: SocialProvider) => {
    try {
      setLoadingProvider(provider);
      console.log(`[LoginScreen] ${provider} 로그인 시작`);

      const result = await socialLogin(provider);

      console.log(`[LoginScreen] ${provider} 로그인 성공:`, result);
    } catch (loginError) {
      console.error(`[LoginScreen] ${provider} 로그인 실패:`, loginError);

      // 에러 메시지 표시
      const errorMessage =
        loginError instanceof Error
          ? loginError.message
          : `${provider} 로그인에 실패했습니다.`;

      Alert.alert('로그인 실패', errorMessage, [
        {
          text: '확인',
          style: 'default',
        },
      ]);
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/common/bg_nonedetail.png')}
        style={[StyleSheet.absoluteFill, {width: '100%', height: '100%'}]}
        resizeMode="cover"
      />

      <Image
        source={require('@/assets/icons/common/appname.png')}
        style={styles.appLogo}
        resizeMode="contain"
      />

      {/* 글로벌 로딩 오버레이 */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>
            {loadingProvider
              ? `${loadingProvider} 로그인 중...`
              : '로그인 중...'}
          </Text>
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
    color: '#ffffff',
    fontSize: 16,
    marginTop: 10,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
