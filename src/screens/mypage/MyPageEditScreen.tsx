import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  TextInput,
  Keyboard,
  Alert
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import {MyPageStackParamList} from '@/navigations/stack/MyPageStackNavigator';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {colors, myPageNavigations} from '@/constants';
import {useHideTabBarOnFocus} from '@/hooks/common/roadBottomNavigationBar';
import IconButton from '@/components/common/IconButton';
import CustomButton from '@/components/common/CustomButton';
import {launchImageLibrary} from 'react-native-image-picker';
import {useUpdateProfile} from '@/hooks/queries/myPage/useMyPage';

const {width: SCREEN_W} = Dimensions.get('window');

function MyPageEditScreen() {
  useHideTabBarOnFocus();
  const navigation = useNavigation<StackNavigationProp<MyPageStackParamList>>();

  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const [nickname, setNickname] = useState('');
  const [checked, setChecked] = useState(false);
  const [introduction, setIntroduction] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const handleSelectImage = () => {
    launchImageLibrary({mediaType: 'photo', quality: 0.8}, response => {
      if (response.assets && response.assets.length > 0) {
        setSelectedImage(response.assets[0].uri || null);
      }
    });
  };

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  // 에러 조건 변수화
  const isInvalidChar =
    nickname !== '' && !/^[a-zA-Z0-9가-힣]+$/.test(nickname);
  const isTooLong = nickname.length > 10;
  const hasError = isInvalidChar || isTooLong;

  const handleSave = () => {
      if (!nickname.trim()) {
        Alert.alert('알림', '닉네임을 입력해주세요.');
        return;
      }
      if (hasError) {
        Alert.alert('알림', '닉네임 형식을 확인해주세요.');
        return;
      }

      updateProfile(
        {
          nickName: nickname,
          intro: introduction,
          profileImg: selectedImage ?? undefined,
        },
        {
          onSuccess: () => {
            Alert.alert('완료', '프로필이 수정되었습니다.', [
              {
                text: '확인',
                onPress: () => navigation.navigate(myPageNavigations.MYPAGE_HOME),
              },
            ]);
          },
          onError: (error) => {
            console.error(error);
            Alert.alert('오류', '프로필 수정 중 문제가 발생했습니다.');
          },
        }
      );
    };

  return (
    <>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <IconButton<PostStackParamList>
              imageSource={require('@/assets/icons/post/BackArrow.png')}
              target={'goBack'}
              size={24}
            />
            <Text style={styles.sectionTitle}>프로필 편집</Text>
          </View>
          {/* 프로필 사진 */}
          <View style={styles.profileWrap}>
            <TouchableOpacity
              style={styles.profile}
              onPress={() => {
                handleSelectImage();
              }}>
              <Image
                source={require('@/assets/icons/mypage/ProfileCamera.png')}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
          {/* 닉네임 */}
          <View style={styles.nicknameWrap}>
            <Text style={styles.h2}>닉네임</Text>
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

              <TouchableOpacity
                style={[
                  styles.duplicate_btn,
                  {opacity: nickname ? 1 : 0, top: hasError ? 8 : 6},
                ]}
                activeOpacity={0.7}
                disabled={!nickname}
                onPress={() => {
                  if (!hasError && nickname) {
                    setChecked(true);
                  } else {
                    setChecked(false);
                  }
                }}>
                <Text style={styles.duplicate_btn_text}>중복확인</Text>
                {/* ++ 나중에  중복확인요청 로직 작성 */}
              </TouchableOpacity>
            </View>
            {isInvalidChar && (
              <Text style={styles.error_text}>
                닉네임은 한글, 영문, 숫자만 입력할 수 있어요.
              </Text>
            )}
            {isTooLong && (
              <Text style={styles.error_text}>
                닉네임은 10글자까지 가능해요.
              </Text>
            )}
          </View>
          {/* 바이오 */}
          <View style={styles.bioWrap}>
            <Text style={styles.h2}>프로필 소개</Text>
            <View style={[styles.inputbar, {position: 'relative'}]}>
              <TextInput
                value={introduction}
                onChangeText={text => {
                  if (text.length <= 200) setIntroduction(text);
                }}
                multiline
                maxLength={200}
                style={{minHeight: 123, textAlignVertical: 'top', padding: 0}}
              />
              {introduction === '' && (
                <Text style={styles.placeholder_text2}>
                  나를 표현하는 소개를 적어보세요.
                </Text>
              )}
              <Text
                style={{
                  position: 'absolute',
                  right: 12,
                  bottom: 8,
                  fontSize: 12,
                  color: colors.GRAY_400,
                }}>
                {introduction.length}/200
              </Text>
            </View>
          </View>
          {/* 음악 */}
          <View style={styles.musicButtonWrap}>
            <TouchableOpacity style={styles.musicButton}>
              <View style={styles.musicWrap}>
                <Image source={require('@/assets/icons/mypage/Music.png')} />
                <Text style={styles.musicText}>프로필 음악 추가</Text>
              </View>
              <Image source={require('@/assets/icons/mypage/RightArrow.png')} />
            </TouchableOpacity>
          </View>
          {!isKeyboardVisible && (
            <View style={styles.bottom}>
              <CustomButton
                label={isPending ? '저장 중...' : '저장하기'}
                onPress={handleSave}
                disabled={isPending}
              />
            </View>
          )}
        </SafeAreaView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    height: 58,
    gap: 12,
  },
  sectionTitle: {
    fontFamily: 'Noto Sans KR',
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '600',
    letterSpacing: 0.1,
    color: colors.BLACK,
  },
  profileWrap: {
    width: '100%',
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profile: {
    width: 103,
    height: 103,
    borderRadius: 999,
    backgroundColor: colors.GRAY_200,
    position: 'relative',
  },
  icon: {
    width: 27.65,
    height: 27.65,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  nicknameWrap: {
    paddingTop: 16,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'start',
    gap: 8,
  },
  h2: {
    fontFamily: 'Noto Sans KR',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    letterSpacing: 0.2,
    color: colors.GRAY_600,
  },
  inputbar: {
    borderRadius: 4,
    backgroundColor: colors.GRAY_100,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.GRAY_600,
    fontSize: 14,
    lineHeight: 20,
  },
  placeholder_text: {
    position: 'absolute',
    left: 12,
    top: 10,
    color: colors.GRAY_200,
    fontSize: 12,
    zIndex: 1,
    lineHeight: 24,
  },
  placeholder_text2: {
    position: 'absolute',
    left: 12,
    top: 10,
    color: colors.GRAY_200,
    fontSize: 14,
    zIndex: 1,
    lineHeight: 20,
    letterSpacing: 0.2,
  },
  duplicate_btn: {
    position: 'absolute',
    right: 8,
    top: 8,
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: colors.GRAY_300,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
  },
  duplicate_btn_text: {
    color: colors.WHITE,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.2,
    fontFamily: 'Noto Sans KR',
  },
  error_text: {
    color: colors.ERROR_RED,
    marginLeft: 4,
  },
  bioWrap: {
    paddingTop: 16,
    paddingBottom: 8,
    paddingHorizontal: 20,
    alignItems: 'start',
    gap: 8,
  },
  musicButtonWrap: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  musicButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  musicWrap: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  musicText: {
    color: colors.BLACK,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.2,
    fontWeight: '500',
    fontFamily: 'Noto Sans KR',
  },
  bottom: {
    paddingHorizontal: 20,
    marginTop: 'auto',
    paddingBottom: 30,
    paddingTop: 6,
    gap: 16,
  },
});

export default MyPageEditScreen;
