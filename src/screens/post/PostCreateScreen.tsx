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
  Image,
} from 'react-native';
//constants
import {colors} from '@/constants';
//types
import {YouTubeVideo, NewPostDTO} from '@/types';
//navigation
import {useNavigation} from '@react-navigation/native';
//utils
import {extractVideoId} from '@/utils/providers';
//hooks
import {useHideTabBarOnFocus} from '@/hooks/common/roadBottomNavigationBar';
import {useUserInfo} from '@/hooks/common/useUserInfo';
import {useImagePicker} from '@/hooks/common/useImagePicker';
import {useCreatePost} from '@/hooks/queries/post/usePostQueries';
import {useUploadImage} from '@/hooks/queries/common/useCommon';
//components
import PostActionButtons from '@/components/post/postcreate/PostActionButtons';
import CustomButton from '@/components/common/CustomButton';
import Toast from '@/components/common/Toast';
import YouTubeEmbed from '@/components/common/YouTubeEmbed';

export default function PostCreateScreen() {
  const navigation = useNavigation();
  useHideTabBarOnFocus();

  const {userInfo, isLoading: userLoading, error: userError} = useUserInfo();
  const createPostMutation = useCreatePost();
  const [content, setContent] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [inputHeight, setInputHeight] = useState(50);
  const {selectedImage, seletedImageURI, selectImage, resetImage} =
    useImagePicker();
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  //toast
  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
  };

  const hideToast = () => {
    setToastVisible(false);
  };

  // 취소 handler (goback)
  const handleCancel = () => {
    navigation.goBack();
  };

  //tag handler
  const handleTagSelect = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else {
      setSelectedTags(prev => [...prev, tag]);
    }
  };

  // img upload mutation
  const uploadImageMutation = useUploadImage('post');

  React.useEffect(() => {
    if (selectedImage && !uploadImageMutation.isPending) {
      console.log('[PostCreateScreen] 이미지 선택됨, 자동 업로드 시작');
      uploadImageMutation.mutate(selectedImage, {
        onSuccess: data => {
          console.log('[PostCreateScreen] 이미지 업로드 성공:', data);
          setUploadedImageUrl(data);
          showToast('이미지가 업로드되었습니다.');
        },
        onError: error => {
          console.log('[PostCreateScreen] 이미지 업로드 실패:', error);
          showToast('이미지 업로드에 실패했습니다.');
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

  //video handler
  const handleVideoSelect = (video: YouTubeVideo) => {
    setSelectedVideo(video);
    if (selectedImage || uploadedImageUrl) {
      // 비디오 선택 시 이미지 제거
      handleRemoveImage();
    }
  };

  const handleRemoveVideo = () => {
    setSelectedVideo(null);
  };

  //게시 handler
  const handlePost = async () => {
    if (!content.trim()) {
      showToast('내용을 입력해주세요.');
      return;
    }

    // 이미지가 업로드 중인 경우 대기
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
        ? `https://www.youtube.com/watch?v=${extractVideoId(
            selectedVideo.thumbnail,
          )}`
        : uploadedImageUrl || '',
      tags: selectedTags,
    };

    console.log('[PostCreateScreen] 전송할 데이터:', postData);

    try {
      await createPostMutation.mutateAsync(postData);
      console.log('[PostCreateScreen] 게시글 작성 완료');
      showToast('게시되었습니다.');

      setTimeout(() => {
        navigation.goBack();
      }, 500);
    } catch (error) {
      console.error('[PostCreateScreen] 게시글 작성 실패:', error);
      showToast('게시글 작성에 실패했습니다.');
    }
  };

  // 제출 또는 업로드 중인지 여부
  const isSubmitting =
    createPostMutation.isPending || uploadImageMutation.isPending;

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

          {/* Selected Image Display */}
          {seletedImageURI && (
            <View style={styles.selectedImageContainer}>
              <Image
                source={{uri: seletedImageURI}}
                style={styles.selectedImage}
              />
              <View style={styles.imageActions}>
                {uploadImageMutation.isPending && (
                  <Text style={styles.uploadingText}>업로드 중...</Text>
                )}
                {uploadedImageUrl && (
                  <Text style={styles.uploadSuccessText}>업로드 완료</Text>
                )}
                {!uploadImageMutation.isPending && !uploadedImageUrl && (
                  <Text style={styles.uploadFailText}>업로드 대기중</Text>
                )}
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={handleRemoveImage}
                  disabled={isSubmitting}>
                  <Text style={styles.removeImageText}>✕</Text>
                </TouchableOpacity>
              </View>
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
          onImageSelect={handleImageSelect}
          selectedTags={selectedTags}
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
  selectedImageContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginVertical: 16,
    padding: 12,
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  imageActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  uploadingText: {
    color: colors.BLUE_400,
    fontSize: 14,
    fontWeight: '500',
  },
  uploadButton: {
    backgroundColor: colors.BLUE_400,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  uploadButtonText: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: '500',
  },
  uploadSuccessText: {
    color: colors.GRAY_600,
    fontSize: 14,
    fontWeight: '500',
  },
  uploadFailText: {
    color: colors.GRAY_400,
    fontSize: 14,
    fontWeight: '500',
  },
  removeImageButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
