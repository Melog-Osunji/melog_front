import React, {useEffect, useState, useRef} from 'react';
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
  Image,
  Keyboard,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
//constants
import {colors, postNavigations} from '@/constants';
//types
import {YouTubeVideo, NewPostDTO} from '@/types';
//navigation
import {StackScreenProps} from '@react-navigation/stack';
import {PostStackParamList} from '@/navigations/stack/PostStackNavigator';
//hooks
import {useHideTabBarOnFocus} from '@/hooks/common/roadBottomNavigationBar';
import {useUserInfo} from '@/hooks/common/useUserInfo';
import {useImagePicker} from '@/hooks/common/useImagePicker';
import {useUploadImage} from '@/hooks/queries/common/useCommonMutations';
import {useCreatePost} from '@/hooks/queries/post/usePostMutations';
import {useDebounce} from '@/hooks/useDebounce';
import {useSearching} from '@/hooks/queries/search/useSearching';
//components
import Toast, {ToastType} from '@/components/common/Toast';
import CustomButton from '@/components/common/CustomButton';
import YouTubeEmbed from '@/components/common/YouTubeEmbed';
import PostActionButtons from '@/components/post/postcreate/PostActionButtons';
import MusicSearchBottomSheet from '@/components/post/postcreate/MusicSearchBottomSheet';

type PostCreateScreenProps = StackScreenProps<
  PostStackParamList,
  typeof postNavigations.POST_CREATE
>;

// 최대 글자수 상수
const MAX_CONTENT_LENGTH = 500;

export default function PostCreateScreen({navigation}: PostCreateScreenProps) {
  useHideTabBarOnFocus();

  // prev content length ref to show toast only once when reaching max
  const prevContentLengthRef = useRef(0);
  const handleContentChange = (text: string) => {
    if (
      text.length === MAX_CONTENT_LENGTH &&
      prevContentLengthRef.current < MAX_CONTENT_LENGTH
    ) {
      showToast('최대 글자수에 도달했습니다.', 'error');
    }
    prevContentLengthRef.current = text.length;
    setContent(text);
  };

  //user info state
  const {userInfo, isLoading: userLoading, error: userError} = useUserInfo();

  // view state
  const [musicSheetVisible, setMusicSheetVisible] = useState(false);
  const [inputHeight, setInputHeight] = useState(50);

  //post create state
  const [content, setContent] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const {selectedImage, seletedImageURI, selectImage, resetImage} =
    useImagePicker();
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null); //backend req

  //toast state
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<ToastType>('none');

  //---------toast---------
  const showToast = (message: string, type: ToastType = 'none') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  const hideToast = () => {
    setToastVisible(false);
  };

  // 취소btn handler
  const handleCancel = () => {
    navigation.goBack();
  };

  // ---------img---------
  const uploadImageMutation = useUploadImage('post');

  React.useEffect(() => {
    if (selectedImage && !uploadImageMutation.isPending) {
      console.log('[PostCreateScreen] 이미지 선택됨, 자동 업로드 시작');
      uploadImageMutation.mutate(selectedImage, {
        onSuccess: data => {
          console.log('[PostCreateScreen] 이미지 업로드 성공:', data);
          setUploadedImageUrl(data);
        },
        onError: error => {
          console.log('[PostCreateScreen] 이미지 업로드 실패:', error);
          handleRemoveImage();
          showToast('이미지 업로드에 실패했습니다.', 'error');
        },
      });
    }
  }, [selectedImage]);

  const handleImageSelect = () => {
    selectImage();
  };

  const handleRemoveImage = () => {
    resetImage();
    setUploadedImageUrl(null);
  };

  //---------video---------
  const handleVideoSelect = (video: YouTubeVideo) => {
    setSelectedVideo(video);
    setMusicSheetVisible(false);
  };

  const handleRemoveVideo = () => {
    setSelectedVideo(null);
  };

  const handleMusicSheetVideoSelect = (video: YouTubeVideo) => {
    handleVideoSelect(video);
  };

  //---------tag---------
  const handleTagSelect = (tag: string) => {
    // toggle selected tag
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag],
    );

    // remove currently-typed #token at end of content (if any)
    setContent(prev => prev.replace(/#([^\s#]*)$/, ''));
    // clear typing state so tag bar closes (forceShowTagBar depends on tagTyping)
    setTagTyping('');
  };

  //---------create post handler---------
  const createPostMutation = useCreatePost();

  const handlePost = async () => {
    if (!content.trim()) {
      showToast('내용을 입력해주세요.', 'error');
      return;
    }

    if (selectedImage && uploadImageMutation.isPending) {
      showToast('이미지 업로드 중입니다. 잠시만 기다려주세요.');
      return;
    }

    const postData: NewPostDTO = {
      title: 'title',
      content: content.trim(),
      mediaType: selectedVideo
        ? 'youtube'
        : uploadedImageUrl
        ? 'image'
        : 'text',
      mediaUrl: selectedVideo
        ? `https://www.youtube.com/watch?v=${selectedVideo.id}`
        : uploadedImageUrl || '',
      tags: selectedTags,
    };

    try {
      await createPostMutation.mutateAsync(postData);
      console.log('[PostCreateScreen] 게시글 작성 완료', postData);
      showToast('게시되었습니다.', 'success');

      setTimeout(() => {
        navigation.goBack();
      }, 500);
    } catch (error) {
      console.error('[PostCreateScreen] 게시글 작성 실패:', error);
      showToast('게시글 작성에 실패했습니다.', 'error');
    }
  };

  const isSubmitting =
    createPostMutation.isPending || uploadImageMutation.isPending;

  // 추가: 현재 입력에서 마지막으로 타이핑중인 '#...' 토큰 추출
  const [tagTyping, setTagTyping] = useState('');
  useEffect(() => {
    const match = content.match(/#([^\s#]*)$/);
    setTagTyping(match ? match[1] : '');
  }, [content]);

  const debouncedTagTyping = useDebounce(tagTyping, 100); // 추가: 아래에서 tagTyping 계산
  const {data: tagSearchData} = useSearching(debouncedTagTyping);
  const tagSuggestions: string[] = tagSearchData?.suggestions ?? [];

  // 자동 태그 선택: 사용자가 스페이스 입력해서 '#tag ' 형태가 된 경우
  useEffect(() => {
    const m = content.match(/#([^\s#]+)\s$/);
    if (m) {
      const tag = m[1];
      handleTagSelect(tag);
      // 입력에서 마지막 '#tag ' 토큰 제거
      setContent(prev => prev.replace(/#([^\s#]+)\s$/, ''));
      // 초기화
      setTagTyping('');
    }
  }, [content]);

  const insets = useSafeAreaInsets();
  const [keyboardVerticalOffset, setKeyboardVerticalOffset] = useState(0);

  useEffect(() => {
    // 키보드가 올라오기 전엔 offset 0
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = (e: any) => {
      const base = Platform.OS === 'ios' ? insets.top + 10 : insets.top + 48;
      setKeyboardVerticalOffset(base);
    };
    const onHide = () => {
      setKeyboardVerticalOffset(0);
    };

    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [insets]);

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
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={keyboardVerticalOffset}>
        {/* main content 영역은 flex:1으로 키보드에 따라 줄어듦 */}
        <View style={{flex: 1}}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={handleCancel}
              style={styles.cancelButton}>
              <Text
                style={[
                  styles.cancelText,
                  isSubmitting && styles.disabledText,
                ]}>
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
                {
                  height: content.trim()
                    ? Math.max(100, inputHeight + 50)
                    : 100,
                },
              ]}
              placeholder="오늘은 어떤 클래식을 감상했나요?"
              placeholderTextColor={colors.GRAY_300}
              multiline
              textAlignVertical="top"
              value={content}
              onChangeText={handleContentChange}
              onContentSizeChange={event => {
                const newHeight = event.nativeEvent.contentSize.height;
                // 텍스트가 있을 때만 높이 업데이트
                if (content.trim()) {
                  setInputHeight(newHeight);
                }
              }}
              editable={!isSubmitting}
              maxLength={MAX_CONTENT_LENGTH}
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

            {/* Selected Image Display */}
            {seletedImageURI && (
              <View style={styles.selectedContainer}>
                <TouchableOpacity onPress={handleRemoveImage}>
                  <Image
                    source={require('@/assets/icons/common/close.png')}
                    style={styles.removeButtonIcon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                <Image
                  source={{uri: seletedImageURI}}
                  style={styles.selectedImage}
                />
              </View>
            )}

            {/* Selected Video Display */}
            {selectedVideo && (
              <View style={styles.selectedContainer}>
                <TouchableOpacity onPress={handleRemoveVideo}>
                  <Image
                    source={require('@/assets/icons/common/close.png')}
                    style={styles.removeButtonIcon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                <View style={styles.videoEmbedWrapper}>
                  <YouTubeEmbed
                    // 우선 YouTubeVideo.url 사용, 없으면 id로 watch URL 구성하여 전달
                    url={
                      selectedVideo.url ||
                      `https://www.youtube.com/watch?v=${selectedVideo.id}`
                    }
                  />
                </View>
              </View>
            )}
          </View>
        </View>

        {/* PostActionButtons는 부모(KeyboardAvoidingView) 하단에 배치 — 키보드가 올라오면 전체 레이아웃이 줄어들어 버튼이 키보드 위에 위치 */}
        <PostActionButtons
          onOpenMusicSheet={() => setMusicSheetVisible(true)}
          onVideoSelect={handleMusicSheetVideoSelect}
          onTagSelect={handleTagSelect}
          onImageSelect={handleImageSelect}
          selectedTags={selectedTags}
          hasMediaSelected={!!seletedImageURI || !!selectedVideo}
          forceShowTagBar={!!tagTyping}
          suggestedTags={tagSuggestions}
        />
      </KeyboardAvoidingView>

      {/* Music Search Bottom Sheet */}
      <MusicSearchBottomSheet
        visible={musicSheetVisible}
        onClose={() => setMusicSheetVisible(false)}
        onVideoSelect={handleMusicSheetVideoSelect}
      />

      {/* Toast */}
      <Toast
        message={toastMessage}
        visible={toastVisible}
        type={toastType}
        position="top"
        onHide={hideToast}
      />
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
  selectedContainer: {
    marginVertical: 16,
    alignItems: 'flex-end',
    gap: 8,
  },
  videoEmbedWrapper: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  removeButtonIcon: {
    width: 28,
    height: 28,
    tintColor: colors.GRAY_200,
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
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    resizeMode: 'cover',
  },
});
