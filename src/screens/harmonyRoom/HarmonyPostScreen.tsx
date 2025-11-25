import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
//constants
import {colors} from '@/constants';
//types
import {YouTubeVideo} from '@/types';
import {CreateHarmonyRoomPostRequest} from '@/api/harmonyRoom/harmonyRoomPostAPi';
//navigation
import {
  useNavigation,
  useFocusEffect,
  useRoute,
} from '@react-navigation/native';
//utils
import {useHideTabBarOnFocus} from '@/hooks/common/roadBottomNavigationBar';
import {getAccessToken} from '@/utils/storage/UserStorage';
//hooks
import {useUserInfo} from '@/hooks/common/useUserInfo';
import {useCreateHarmonyRoomPost} from '@/hooks/queries/harmonyRoom/useHarmonyRoomPost';
//components
import PostActionButtons from '@/components/post/postcreate/PostActionBar';
import CustomButton from '@/components/common/CustomButton';
import Toast from '@/components/common/Toast';
import YouTubeEmbed from '@/components/common/YouTubeEmbed';

export default function HarmonyPostScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const {harmonyId} = route.params;
  console.log(harmonyId);
  const {userInfo, isLoading: userLoading, error: userError} = useUserInfo();
  const createPostMutation = useCreateHarmonyRoomPost(harmonyId);
  const [content, setContent] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [inputHeight, setInputHeight] = useState(50);

  useHideTabBarOnFocus();

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
  };

  const hideToast = () => {
    setToastVisible(false);
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleTagSelect = (tag: string) => {
    if (selectedTags.includes(tag)) {
      // 이미 선택된 태그면 제거
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else {
      // 새로운 태그면 추가
      setSelectedTags(prev => [...prev, tag]);
    }
  };

  const handlePost = async () => {
    if (!content.trim()) {
      showToast('내용을 입력해주세요.');
      return;
    }

    const accessToken = await getAccessToken();
    console.log(
      '[PostCreateScreen] Access Token:',
      accessToken ? '존재함' : '없음',
    );

    if (!accessToken) {
      console.error('[PostCreateScreen] 토큰이 없습니다. 로그인이 필요합니다.');
      showToast('로그인이 필요합니다.');
      return;
    }

    console.log('게시글 작성 시작');
    console.log('작성자 정보:', userInfo);

    const postData: CreateHarmonyRoomPostRequest = {
      content: content.trim(),
      mediaType: 'youtube',
      mediaUrl: selectedVideo
        ? `https://www.youtube.com/watch?v=${extractVideoId(
            selectedVideo.thumbnail,
          )}`
        : '',
      tags: selectedTags,
    };

    console.log('전송할 데이터:', postData);

    try {
      await createPostMutation.mutateAsync(postData);
      console.log('게시글 작성 완료');
      showToast('게시되었습니다.');

      setTimeout(() => {
        navigation.goBack();
      }, 1000);
    } catch (error) {
      console.error('게시글 작성 실패:', error);
      showToast('게시글 작성에 실패했습니다.');
    }
  };

  const handleVideoSelect = (video: YouTubeVideo) => {
    setSelectedVideo(video);
  };

  const handleRemoveVideo = () => {
    setSelectedVideo(null);
  };

  // YouTube URL에서 비디오 ID 추출하는 함수
  const extractVideoId = (url: string) => {
    const regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : 'dQw4w9WgXcQ'; // 기본값
  };

  const isSubmitting = createPostMutation.isPending;

  if (userLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>사용자 정보를 불러오는 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleCancel}
            style={styles.cancelButton}
            disabled={isSubmitting}>
            <Text
              style={[styles.cancelText, isSubmitting && styles.disabledText]}>
              취소
            </Text>
          </TouchableOpacity>

          <CustomButton
            label={isSubmitting ? '게시 중...' : '게시'}
            variant="filled"
            size="small"
            inValid={!content.trim() || isSubmitting}
            onPress={handlePost}
          />
        </View>

        {/* User Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImage} />
          <Text style={styles.userId}>{userInfo?.nickName || '사용자'}</Text>
        </View>

        {/* Content Input */}
        <View style={styles.contentSection}>
          <TextInput
            style={[
              styles.contentInput,
              {height: content.trim() ? Math.max(100, inputHeight + 50) : 100},
            ]}
            placeholder="오늘은 어떤 클래식을 감상했나요?"
            placeholderTextColor={colors.GRAY_300}
            multiline
            textAlignVertical="top"
            value={content}
            onChangeText={text => {
              setContent(text);
            }}
            onContentSizeChange={event => {
              const newHeight = event.nativeEvent.contentSize.height;
              // 텍스트가 있을 때만 높이 업데이트
              if (content.trim()) {
                setInputHeight(newHeight);
              }
            }}
            editable={!isSubmitting}
          />

          {selectedTags.length > 0 && (
            <View style={styles.selectedTagsContainer}>
              {selectedTags.map(tag => (
                <View key={tag} style={styles.selectedTag}>
                  <TouchableOpacity onPress={() => handleTagSelect(tag)}>
                    <Text style={styles.selectedTagText}>#{tag}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Selected Video Display */}
          {selectedVideo && (
            <View style={styles.selectedVideoContainer}>
              <View style={styles.videoEmbedWrapper}>
                <YouTubeEmbed
                  url={`https://www.youtube.com/watch?v=${extractVideoId(
                    selectedVideo.thumbnail,
                  )}`}
                />
                <TouchableOpacity
                  style={styles.removeVideoButton}
                  onPress={handleRemoveVideo}
                  disabled={isSubmitting}>
                  <Text style={styles.removeVideoText}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <PostActionButtons
          onVideoSelect={handleVideoSelect}
          onTagSelect={handleTagSelect}
        />
      </KeyboardAvoidingView>

      {/* Toast */}
      <Toast message={toastMessage} visible={toastVisible} onHide={hideToast} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  cancelButton: {
    paddingVertical: 8,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: 0.2,
    color: colors.BLACK,
  },
  postButton: {
    backgroundColor: colors.BLUE_400,
    paddingHorizontal: 24,
    paddingVertical: 6,
    borderRadius: 60,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  profileImage: {
    width: 48,
    height: 48,
    backgroundColor: '#D9D9D9',
    borderRadius: 24,
  },
  userId: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
    letterSpacing: 0.15,
    color: colors.BLACK,
  },
  contentSection: {
    paddingHorizontal: 18,
  },
  contentInput: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: 0.2,
    color: colors.BLACK,
    textAlignVertical: 'top',
    paddingHorizontal: 6,
  },
  selectedVideoContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginVertical: 16,
  },
  videoEmbedWrapper: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  removeVideoButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  removeVideoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  selectedTagsContainer: {
    marginTop: -40,
    marginHorizontal: 4,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  selectedTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedTagText: {
    fontSize: 14,
    color: colors.BLACK,
    fontWeight: '500',
  },
  disabledText: {
    color: colors.GRAY_300,
  },
});
