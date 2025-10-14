import React, {useState, useEffect} from 'react';
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
import {YouTubeVideo, PostDTO, ProfileDTO} from '@/types';
//navigation
import {useNavigation} from '@react-navigation/native';
//utils
import {useHideTabBarOnFocus} from '@/utils/roadBottomNavigationBar';
//contexts
import {usePostContext} from '@/contexts/PostContext';
//components
import PostActionButtons from '@/components/post/postcreate/PostActionButtons';
import CustomButton from '@/components/common/CustomButton';
import Toast from '@/components/common/Toast';
import YouTubeEmbed from '@/components/common/YouTubeEmbed';
//hooks
import {useUserInfo} from '@/hooks/common/useUserInfo';

export default function PostCreateScreen() {
  const navigation = useNavigation();
  const {addPost} = usePostContext();

  // ✅ 간단하고 깔끔하게 사용자 정보 가져오기
  const {userInfo, isLoading: userLoading, error: userError} = useUserInfo();

  const [content, setContent] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [inputHeight, setInputHeight] = useState(50);

  useHideTabBarOnFocus();

  // ✅ 로딩 상태 처리
  if (userLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>사용자 정보를 불러오는 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ✅ 에러 상태 처리
  if (userError) {
    console.error('[PostCreateScreen] 사용자 정보 오류:', userError);
  }

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

  const handlePost = () => {
    if (!content.trim()) {
      showToast('내용을 입력해주세요.');
      return;
    }

    console.log('[PostCreateScreen] 게시글 작성 시작');
    console.log('[PostCreateScreen] 작성자 정보:', userInfo);

    // 새로운 포스트 생성
    const newPost: PostDTO = {
      id: `post_${Date.now()}`, // 임시 ID 생성
      userId: userInfo?.id || 'anonymous',
      content: content.trim(),
      mediaType: selectedVideo ? 'youtube' : 'text',
      mediaUrl: selectedVideo ? extractVideoUrl(selectedVideo) : undefined,
      createdAgo: 0, // 방금 생성됨
      likeCount: 0,
      commentCount: 0,
      tags: selectedTags, // 선택된 태그들 사용
      user: {
        profileImg: userInfo?.profileImg || '',
        nickName: userInfo?.nickName || '익명',
      },
    };

    console.log('[PostCreateScreen] 생성된 포스트:', newPost);

    // Context에 포스트 추가
    addPost(newPost);

    navigation.goBack();

    showToast('게시되었습니다.');
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
            <Text style={styles.cancelText}>취소</Text>
          </TouchableOpacity>

          <CustomButton
            label="게시"
            variant="filled"
            size="small"
            inValid={!content.trim()}
            onPress={handlePost}
          />
        </View>

        {/* User Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImage} />
          <Text style={styles.userId}>
            {userInfo?.nickName || '사용자'}
          </Text>
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
                  onPress={handleRemoveVideo}>
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
  loadingContainer:{
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
});
