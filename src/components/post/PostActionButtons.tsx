import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import {colors} from '@/constants';
//components
import PhotoBottomSheet from './PhotoBottomSheet';
import MusicSearchBottomSheet from './MusicSearchBottomSheet';
import RecommendTags from './RecommendTags';
import {YouTubeVideo} from '@/constants/types';

interface PostActionButtonsProps {
  onVideoSelect?: (video: YouTubeVideo) => void;
  onTagSelect?: (tag: string) => void;
}

export default function PostActionButtons({
  onVideoSelect,
  onTagSelect,
}: PostActionButtonsProps) {
  const [activeButton, setActiveButton] = useState<'music' | 'photo' | 'tag'>(
    'music',
  );
  const [isPhotoBottomSheetVisible, setIsPhotoBottomSheetVisible] =
    useState(false);
  const [isMusicSearchVisible, setIsMusicSearchVisible] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTagBar, setShowTagBar] = useState(false);

  const handleMusicPress = () => {
    setActiveButton('music');
    setIsMusicSearchVisible(true);
  };

  const handlePhotoPress = () => {
    setActiveButton('photo');
    setIsPhotoBottomSheetVisible(true);
  };

  const handleTagPress = () => {
    setActiveButton('tag');
    setShowTagBar(!showTagBar);
  };

  const handleVideoSelect = (video: YouTubeVideo) => {
    setIsMusicSearchVisible(false);
    onVideoSelect?.(video);
    console.log('선택된 비디오:', video);
  };

  const handleTagSelect = (tag: string) => {
    console.log('선택된 태그:', tag);
    // 상위 컴포넌트의 onTagSelect 호출
    onTagSelect?.(tag);

    // 로컬 상태도 업데이트 (UI 표시용)
    if (selectedTags.includes(tag)) {
      // 이미 선택된 태그면 제거
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else {
      // 새로운 태그면 추가
      setSelectedTags(prev => [...prev, tag]);
    }
  };

  const renderIcon = (
    buttonType: 'music' | 'photo' | 'tag',
    iconSource: any,
  ) => {
    return (
      <View style={styles.iconContainer}>
        <Image source={iconSource} style={styles.iconImage} />
      </View>
    );
  };

  const renderText = (buttonType: 'music' | 'photo' | 'tag', label: string) => {
    return (
      <Text
        style={[
          styles.buttonText,
          buttonType === 'music' && styles.musicButtonText,
        ]}>
        {label}
      </Text>
    );
  };

  return (
    <View style={styles.container}>
      {/* 태그 바 */}
      <RecommendTags
        visible={showTagBar}
        selectedTags={selectedTags}
        onTagSelect={handleTagSelect}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleMusicPress}>
          {renderIcon('music', require('@/assets/icons/post/FindMusic.png'))}
          {renderText('music', '동영상')}
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handlePhotoPress}>
          {renderIcon('photo', require('@/assets/icons/post/Picture.png'))}
          {renderText('photo', '이미지')}
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleTagPress}>
          {renderIcon('tag', require('@/assets/icons/post/Tag.png'))}
          {renderText('tag', '태그')}
        </TouchableOpacity>
      </View>

      {/* Photo BottomSheet */}
      <PhotoBottomSheet
        visible={isPhotoBottomSheetVisible}
        onClose={() => setIsPhotoBottomSheetVisible(false)}
      />

      {/* Music Search BottomSheet */}
      <MusicSearchBottomSheet
        visible={isMusicSearchVisible}
        onClose={() => setIsMusicSearchVisible(false)}
        onVideoSelect={handleVideoSelect}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.WHITE,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.GRAY_200,
    paddingHorizontal: 18,
    gap: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    letterSpacing: 0.2,
    color: colors.GRAY_300,
  },
  musicButtonText: {
    color: '#155B7E',
  },
});
