// KakaoLogin.tsx
import React, {useState} from 'react';
import {
  View,
  Button,
  Modal,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import {WebView, WebViewNavigation} from 'react-native-webview';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {authNaviagtions, colors} from '@/constants';
import {KAKAO_REST_API_KEY, KAKAO_REDIRECT_URI} from '@/config';
import {saveAccessToken} from '@/utils/tokenStorage';

// 예시: 환경 변수에서 불러오기
const KAKAO_CLIENT_ID = KAKAO_REST_API_KEY;
const REDIRECT_URI = KAKAO_REDIRECT_URI;

interface KakaoLoginProps {
  onPress?: () => void;
}

const KakaoLogin = ({onPress}: KakaoLoginProps) => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI,
  )}&response_type=code`;

  const onNavigationStateChange = async (navState: WebViewNavigation) => {
    const {url} = navState;

    if (url.startsWith(REDIRECT_URI)) {
      const matched = url.match(/[?&]code=([^&]+)/);
      const authCode = matched?.[1];
      console.log('⭐ 인가 코드:', authCode);
      if (authCode) {
        setModalVisible(false);
        try {
          // ✅ 인가 코드 백엔드로 전송
          const response = await fetch('http://10.0.2.2:8080/api/auth/kakao', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({code: authCode}),
          });

          console.log('📦 응답 상태:', response.status);
          const text = await response.text();
          console.log('📄 raw response:', text);

          let data: any;
          try {
            data = JSON.parse(text);
            console.log('✅ Parsed JSON:', data);
          } catch (e) {
            console.error('❌ JSON parse error:', e);
            Alert.alert('로그인 실패', '서버 응답이 유효한 JSON이 아닙니다.');
            return;
          }

          if (!response.ok) throw new Error('서버 응답 실패');

          if (!data.success) {
            // 서버에서 성공 응답이 아니면 에러 처리
            const errorMsg = data.error?.message || '알 수 없는 오류 발생';
            throw new Error(errorMsg);
          }

          const {accessToken, refreshToken} = data.response;

          if (!accessToken || !refreshToken) {
            throw new Error('토큰이 응답에 없습니다.');
          }
          console.log('Access:', accessToken);
          console.log('Refresh:', refreshToken);

          // accessToken 저장
          await saveAccessToken(accessToken);

          // 인증 성공 후에만 navigation 실행
          navigation.navigate(authNaviagtions.AUTH_LOC as never); // ← 원하는 화면 이름으로 변경
        } catch (error) {
          console.error('fetch 에러:', error);
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          Alert.alert('로그인 실패', errorMessage);
        }
      }
    }
  };

  const handlePress = () => {
    setModalVisible(true); // onPress는 모달만 띄움
  };

  return (
    <View style={styles.container}>
      {/* 기존 Button 대신 TouchableOpacity로 커스텀 버튼 */}
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Image
          source={require('@/assets/icons/kakao_icon.png')}
          style={{width: 24, height: 24, position: 'absolute', left: 20}}
          resizeMode="contain"
        />
        <Text style={styles.buttonText}>카카오톡으로 시작하기</Text>
      </TouchableOpacity>
      <Modal visible={modalVisible} animationType="slide">
        <View style={{flex: 1}}>
          {loading && (
            <ActivityIndicator style={StyleSheet.absoluteFill} size="large" />
          )}
          <WebView
            originWhitelist={['*']}
            cacheEnabled={false}
            incognito={true} // 시크릿 모드로 실행 → 캐시, 쿠키 초기화
            source={{uri: kakaoAuthUrl}}
            onLoadEnd={() => setLoading(false)}
            onNavigationStateChange={onNavigationStateChange}
            startInLoadingState
          />
        </View>
      </Modal>
    </View>
  );
};

export default KakaoLogin;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    width: '100%',
    zIndex: 1,
  },
  button: {
    backgroundColor: colors.KAKAO_YELLOW,
    borderRadius: 24,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: colors.BLACK,
    fontWeight: 'bold',
  },
});
