import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Dimensions,
  FlatList,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  useNavigation,
  useFocusEffect,
  useRoute,
} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {HarmonyStackParamList} from '@/navigations/stack/HarmonyStackNavigator';
import styled from 'styled-components/native';
import {colors, harmonyNavigations} from '@/constants';
import IconButton from '@/components/common/IconButton';
import YouTubeEmbed from '@/components/common/YouTubeEmbed';
import {useHideTabBarOnFocus} from '@/hooks/common/roadBottomNavigationBar';
import TagInputBox from '@/components/harmonyRoom/TagInputBox';
import MusicSearchBottomSheet from '@/components/post/MusicSearchBottomSheet';
import {useHarmonyRoomContext} from '@/contexts/HarmonyRoomContext';
import CustomButton from '@/components/common/CustomButton';
import {launchImageLibrary} from 'react-native-image-picker';
import CheckPopup from '@/components/common/CheckPopup';
import {
  useUpdateHarmonyRoom,
  useUploadHarmonyImage,
} from '@/hooks/queries/harmonyRoom/useHarmonyRoomPost';
import {useHarmonyRoomDetailInfo} from '@/hooks/queries/harmonyRoom/useHarmonyRoomGet';

const DEVICE_WIDTH = Dimensions.get('window').width;

type NavigationProp = StackNavigationProp<HarmonyStackParamList>;

const ALL_KEYWORDS = [
  '키워드',
  '키큰플레이리스트',
  '키스신OST',
  '피아노',
  '현악',
  '관현악',
  '낭만주의',
  '집중',
  '공부',
  '아침',
  '저녁',
  '명상',
  '수면',
  '봄',
  '여름',
  '가을',
  '겨울',
];

type HarmonySettingRouteProp = StackScreenProps<
  HarmonyStackParamList,
  'HARMONY_EDIT'
>['route'];

function HarmonyEditScreen() {
  const route = useRoute<HarmonyPageScreenRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const {addRoom} = useHarmonyRoomContext();
  const {roomID} = route.params;

  useHideTabBarOnFocus();

  const {
    data: detail,
    isLoading: isDetailLoading,
    isError,
  } = useHarmonyRoomDetailInfo(roomID);
  const updateMutation = useUpdateHarmonyRoom(roomID);
  const uploadMutation = useUploadHarmonyImage(roomID);

  const [roomName, setRoomName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{
    uri: string;
    name?: string;
    type?: string;
    isLocal?: boolean;
  } | null>(null);

  const [showExitPopup, setShowExitPopup] = useState(false);

  const didInitRef = useRef(false);
  useEffect(() => {
    if (!detail || didInitRef.current) return;

    setRoomName(detail.name ?? '');
    setDescription(detail.intro ?? '');
    setTags(Array.isArray(detail.category) ? detail.category : []);
    if (detail.profileImgLink) {
      setSelectedImage({ uri: detail.profileImgLink, isLocal: false });
    }

    didInitRef.current = true;
  }, [detail]);

        
  const handleSelectImage = () => {
    launchImageLibrary({mediaType: 'photo', quality: 0.9}, response => {
      const a = response.assets?.[0];
      if (!a?.uri) return;
      setSelectedImage({
        uri: a.uri,
        name: a.fileName ?? undefined,
        type: a.type ?? undefined,
        isLocal: true,
      });
    });
  };

  const handleBackPress = () => {
    setShowExitPopup(true);
  };

  // 팝업에서 나가기 확인
  const handleConfirmExit = () => {
    setShowExitPopup(false);
    navigation.goBack();
  };

  // 팝업에서 취소
  const handleCancelExit = () => {
    setShowExitPopup(false);
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

  console.log(roomID);

  const handleSave = async () => {
    try {
      if (!roomName.trim()) {
        Alert.alert('알림', '방 이름을 입력해주세요.');
        return;
      }

      // 1) 이미지가 새로 선택된 로컬이면 업로드
      let profileImgUrl: string | undefined = undefined;
      if (selectedImage?.isLocal && selectedImage.uri) {
        profileImgUrl = await uploadMutation.mutateAsync({
          uri: selectedImage.uri,
          name: selectedImage.name,
          type: selectedImage.type,
        });
      } else if (selectedImage?.uri) {
        profileImgUrl = selectedImage.uri; // 기존 서버 URL 유지
      }

      console.log(profileImgUrl);
      // 2) PATCH 업데이트
      await updateMutation.mutateAsync({
        name: roomName.trim(),
        intro: description.trim(),
        category: tags,
        profileImg: profileImgUrl,
      });

      navigation.navigate(harmonyNavigations.HARMONY_PAGE, {roomID: roomID});
    } catch (e: any) {
      const msg =
        e?.response?.data?.message || e?.message || '수정에 실패했습니다.';
      Alert.alert('에러', msg);
      console.log(msg);
    }
  };

  return (
    <>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBackPress}>
              <Image
                source={require('@/assets/icons/post/BackArrow.png')}
                style={{width: 24, height: 24}}
              />
            </TouchableOpacity>
            <Text style={styles.sectionTitle}>하모니룸 변경하기</Text>
          </View>

          {/* 이미지 수정 */}
          <View style={styles.profileWrap}>
            <TouchableOpacity
              style={styles.profile}
              onPress={() => {
                handleSelectImage();
              }}>
              {selectedImage?.uri ? (
                <Image
                  source={{uri: selectedImage.uri}}
                  style={{width: '100%', height: '100%', borderRadius: 999}}
                />
              ) : null}
              <Image
                source={require('@/assets/icons/mypage/ProfileCamera.png')}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>

          {/* 방 이름 */}
          <View style={styles.section1}>
            <Text style={styles.label}>하모니룸 이름</Text>
            <View style={styles.shortInputBar}>
              <TextInput
                value={roomName}
                onChangeText={text => {
                  if (text.length <= 25) setRoomName(text);
                }}
                maxLength={25}
                style={{height: 44}}
                placeholderTextColor={colors.GRAY_200}
                placeholder="어떤 하모니룸을 만들고 싶나요?"
              />
              <Text
                style={{
                  fontSize: 12,
                  color: colors.GRAY_400,
                  position: 'absolute',
                  top: 14,
                  right: 16,
                }}>
                {roomName.length}/25
              </Text>
            </View>
          </View>

          {/* 카테고리 */}
          <View style={styles.section}>
            <Text style={styles.label}>카테고리 생성</Text>
            <TagInputBox
              tags={tags}
              setTags={setTags}
              allKeywords={ALL_KEYWORDS}
              maxTags={3}
            />
          </View>
          {/* 방 설명 */}
          <View style={styles.section1}>
            <Text style={styles.label}>하모니룸 소개</Text>
            <View style={[styles.inputbar, {position: 'relative'}]}>
              <TextInput
                value={description}
                onChangeText={text => {
                  if (text.length <= 100) setDescription(text);
                }}
                multiline
                maxLength={100}
                style={{minHeight: 123, textAlignVertical: 'top', padding: 0}}
              />
              {description === '' && (
                <Text style={styles.placeholder_text}>
                  하모니룸에 대해서 소개해주세요.
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
                {description.length}/100
              </Text>
            </View>
          </View>

          {/* 규칙 */}
          <View
            style={{paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16}}>
            <View style={styles.inputBarWrap}>
              <Text
                style={{color: colors.GRAY_200, fontSize: 14, lineHeight: 20}}>
                멜로그 내 하모니룸 규칙
              </Text>
              <View style={styles.confirmWrap}>
                <Text style={styles.confirmText}>확인 필수</Text>
                <Image
                  source={require('@/assets/icons/mypage/RightArrow.png')}
                  style={styles.confirmBtn}
                />
              </View>
            </View>
          </View>

          {/* 고정된 버튼 */}
          {!isKeyboardVisible && (
            <View style={styles.bottom}>
              <CustomButton
                label={
                  uploadMutation.isPending || updateMutation.isPending
                    ? '변경 중…'
                    : '변경하기'
                }
                disabled={uploadMutation.isPending || updateMutation.isPending}
                onPress={handleSave}
                style={{backgroundColor: colors.BLUE_500}}
              />
            </View>
          )}
        </SafeAreaView>
      </KeyboardAvoidingView>

      {/* 나가기 확인 팝업 */}
      <CheckPopup
        visible={showExitPopup}
        onClose={handleCancelExit}
        onExit={handleConfirmExit}
        content="변경하지 않고 나갈까요?"
        leftBtnColor={colors.BLUE_400}
        leftBtnTextColor={colors.WHITE}
        leftBtnText="나가기"
        rightBtnColor={colors.GRAY_100}
        rightBtnTextColor={colors.GRAY_300}
        rightBtnText="취소"
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    height: 58,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '600',
    color: colors.GRAY_600,
  },
  searchContainer: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.GRAY_100,
    borderRadius: 8,
    paddingHorizontal: 8,
    height: 44,
    gap: 8,
    marginBottom: 6,
  },
  searchIcon: {
    width: 24,
    height: 24,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.2,
    color: colors.GRAY_300,
    fontFamily: 'Noto Sans KR',
  },
  searchGuide: {
    fontSize: 12,
    fontWeight: '400',
    color: '#659CC7',
    lineHeight: 16,
  },
  section1: {
    flexDirection: 'column',
    gap: 8,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  section: {
    paddingHorizontal: 20,
    flexDirection: 'column',
    gap: 8,
    paddingTop: 16,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Noto Sans KR',
    color: colors.GRAY_600,
    fontWeight: 'bold',
  },
  input: {
    height: 44,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.GRAY_200,
    borderRadius: 8,
  },
  shortInputBar: {
    borderRadius: 8,
    backgroundColor: colors.GRAY_100,
    color: colors.GRAY_600,
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    position: 'relative',
  },
  inputbar: {
    borderRadius: 8,
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
    fontSize: 14,
    zIndex: 1,
    lineHeight: 24,
  },
  inputBarWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.GRAY_100,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  confirmWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  confirmText: {
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.2,
    color: colors.GRAY_600,
  },
  bottom: {
    marginBottom: 30,
    paddingHorizontal: 20,
    marginTop: 'auto',
    paddingTop: 6,
  },
  profileWrap: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  profile: {
    width: 75,
    height: 75,
    borderRadius: 999,
    backgroundColor: colors.GRAY_100,
    position: 'relative',
  },
  icon: {
    width: 22,
    height: 22,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});

export default HarmonyEditScreen;
