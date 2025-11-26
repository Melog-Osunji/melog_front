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
} from 'react-native';

import {colors} from '@/constants';
import {YouTubeVideo} from '@/types';
import {CreateHarmonyRoomPostRequest} from '@/api/harmonyRoom/harmonyRoomPostAPi';

// navigation
import {useNavigation, useRoute} from '@react-navigation/native';

// utils
import {useHideTabBarOnFocus} from '@/hooks/common/roadBottomNavigationBar';
import {getAccessToken} from '@/utils/storage/UserStorage';

// hooks
import {useUserProfile} from '@/hooks/queries/User/useUserQueries';
import {useCreateHarmonyRoomPost} from '@/hooks/queries/harmonyRoom/useHarmonyRoomPost';

import {useImagePicker} from '@/hooks/common/useImagePicker';
import {useUploadImage} from '@/hooks/queries/common/useCommonMutations';
import {useDebounce} from '@/hooks/useDebounce';
import {useSearching} from '@/hooks/queries/search/useSearching';

// components
import CustomButton from '@/components/common/CustomButton';
import YouTubeEmbed from '@/components/common/YouTubeEmbed';
import PostActionButtons from '@/components/post/postcreate/PostActionBar';
import MusicSearchBottomSheet from '@/components/post/postcreate/MusicSearchSheet';
import {showToast} from '@/components/common/ToastService';

// 최대 글자수
const MAX_CONTENT_LENGTH = 500;

export default function HarmonyPostScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const {harmonyId} = route.params;

  const {
    data: userInfo,
    isLoading: userLoading,
  } = useUserProfile();

  const createPostMutation = useCreateHarmonyRoomPost(harmonyId);
  const [content, setContent] = useState('');
  const [inputHeight, setInputHeight] = useState(50);

  // 미디어
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);

  // 이미지
  const {selectedImage, seletedImageURI, selectImage, resetImage} =
    useImagePicker();
  const uploadImageMutation = useUploadImage('post');
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  // 태그
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagTyping, setTagTyping] = useState('');

  // BottomSheet
  const [musicSheetVisible, setMusicSheetVisible] = useState(false);

  // 글자수 제한 Toast 1회
  const prevContentLengthRef = useRef(0);

  useHideTabBarOnFocus();

  // ===============================
  // 이미지 자동 업로드
  // ===============================
  useEffect(() => {
    if (selectedImage && !uploadImageMutation.isPending) {
      uploadImageMutation.mutate(selectedImage, {
        onSuccess: data => {
          setUploadedImageUrl(data);
        },
        onError: () => {
          handleRemoveImage();
          showToast('이미지 업로드에 실패했습니다.', 'error');
        },
      });
    }
  }, [selectedImage]);

  const handleRemoveImage = () => {
    resetImage();
    setUploadedImageUrl(null);
  };

  // ===============================
  // 태그 자동 추천
  // ===============================
  useEffect(() => {
    const match = content.match(/#([^\s#]*)$/);
    setTagTyping(match ? match[1] : '');
  }, [content]);

  const debouncedTagTyping = useDebounce(tagTyping, 100);
  const {data: tagSearchData} = useSearching(debouncedTagTyping);
  const tagSuggestions = tagSearchData?.suggestions ?? [];

  // 스페이스 입력 시 '#tag ' 자동으로 선택 처리
  useEffect(() => {
    const m = content.match(/#([^\s#]+)\s$/);
    if (m) {
      const tag = m[1];
      handleTagSelect(tag);
      setContent(prev => prev.replace(/#([^\s#]+)\s$/, ''));
      setTagTyping('');
    }
  }, [content]);

  const handleTagSelect = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag],
    );

    // 현재 작성 중인 #token 제거
    setContent(prev => prev.replace(/#([^\s#]*)$/, ''));
    setTagTyping('');
  };

  // ===============================
  // Content 변경
  // ===============================
  const handleContentChange = (text: string) => {
    if (
      text.length === MAX_CONTENT_LENGTH &&
      prevContentLengthRef.current < MAX_CONTENT_LENGTH
    ) {
      showToast('최대 글자수에 도달했습니다.', 'error', 'top', 10);
    }
    prevContentLengthRef.current = text.length;
    setContent(text);
  };

  // ===============================
  // YouTube video
  // ===============================
  const extractVideoId = (url: string) => {
    const regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : '';
  };

  const handleVideoSelect = (video: YouTubeVideo) => {
    setSelectedVideo(video);
    setMusicSheetVisible(false);
  };

  const handleRemoveVideo = () => {
    setSelectedVideo(null);
  };

  // ===============================
  // 게시글 작성
  // ===============================
  const handlePost = async () => {
    if (!content.trim()) {
      showToast('내용을 입력해주세요.', 'error');
      return;
    }

    const accessToken = await getAccessToken();
    if (!accessToken) {
      showToast('로그인이 필요합니다.', 'error');
      return;
    }

    const mediaType =
      selectedVideo !== null
        ? 'youtube'
        : uploadedImageUrl
        ? 'image'
        : 'text';

    const mediaUrl =
      selectedVideo !== null
        ? `https://www.youtube.com/watch?v=${extractVideoId(
            selectedVideo.thumbnail,
          )}`
        : uploadedImageUrl || '';

    const postData: CreateHarmonyRoomPostRequest = {
      content: content.trim(),
      mediaType,
      mediaUrl,
      tags: selectedTags,
    };

    try {
      await createPostMutation.mutateAsync(postData);
      showToast('게시되었습니다.', 'success');
      setTimeout(() => navigation.goBack(), 500);
    } catch (error) {
      showToast('게시글 작성에 실패했습니다.', 'error');
    }
  };

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
      <StatusBar barStyle="dark-content" backgroundColor={colors.WHITE} />

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={'padding'}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            disabled={isSubmitting}>
            <Text style={[styles.cancelText, isSubmitting && styles.disabledText]}>
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

        {/* Profile */}
        <View style={styles.profileSection}>
          <Image
            source={
              userInfo?.profileImg
                ? {uri: userInfo.profileImg}
                : require('@/assets/icons/common/EmptyProfile.png')
            }
            style={styles.profileImage}
          />
          <Text style={styles.userId}>{userInfo?.nickName}</Text>
        </View>

        {/* Content */}
        <View style={styles.contentSection}>
          <TextInput
            style={[
              styles.contentInput,
              {
                height: content.trim() ? Math.max(100, inputHeight + 50) : 100,
              },
            ]}
            placeholder="오늘은 어떤 클래식을 감상했나요?"
            placeholderTextColor={colors.GRAY_300}
            multiline
            value={content}
            onChangeText={handleContentChange}
            onContentSizeChange={e =>
              content.trim() && setInputHeight(e.nativeEvent.contentSize.height)
            }
            editable={!isSubmitting}
            maxLength={MAX_CONTENT_LENGTH}
          />

          {/* selected tags */}
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

          {/* 이미지 미리보기 */}
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

          {/* Youtube 미리보기 */}
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

        <PostActionButtons
          onOpenMusicSheet={() => setMusicSheetVisible(true)}
          onVideoSelect={handleVideoSelect}
          onTagSelect={handleTagSelect}
          onImageSelect={selectImage}
          selectedTags={selectedTags}
          hasMediaSelected={!!seletedImageURI || !!selectedVideo}
          forceShowTagBar={!!tagTyping}
          suggestedTags={tagSuggestions}
        />
      </KeyboardAvoidingView>

      <MusicSearchBottomSheet
        visible={musicSheetVisible}
        onClose={() => setMusicSheetVisible(false)}
        onVideoSelect={handleVideoSelect}
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
    fontSize: 15,
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
