import React, {useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import {colors} from '@/constants';
//components
import MusicSearchBottomSheet from './MusicSearchBottomSheet';
import RecommendTags from './RecommendTags';
import {YouTubeVideo} from '@/types';

interface PostActionButtonsProps {
  onVideoSelect?: (video: YouTubeVideo) => void;
  onTagSelect?: (tag: string) => void;
  onImageSelect?: () => void;
  selectedTags?: string[];
}

export default function PostActionButtons({
  onVideoSelect,
  onTagSelect,
  onImageSelect,
  selectedTags = [], // 부모에서 받은 태그 사용
}: PostActionButtonsProps) {
  const [isMusicSearchVisible, setIsMusicSearchVisible] = useState(false);
  const [showTagBar, setShowTagBar] = useState(false);

  const handleTagSelect = (tag: string) => {
    console.log('[PostActionButtons] 선택된 태그:', tag);
    onTagSelect?.(tag);
  };

  const handlePhotoPress = () => {
    onImageSelect?.();
  };

  const handleMusicPress = () => {
    setIsMusicSearchVisible(true);
  };

  const handleTagPress = () => {
    console.log('[PostActionButtons] 태그 버튼 클릭');
    setShowTagBar(!showTagBar);
  };

  const handleVideoSelect = (video: YouTubeVideo) => {
    setIsMusicSearchVisible(false);
    onVideoSelect?.(video);
    console.log('선택된 비디오:', video);
  };

  const renderIcon = (iconSource: any) => {
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
      <RecommendTags
        visible={showTagBar}
        selectedTags={selectedTags}
        onTagSelect={handleTagSelect}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleMusicPress}>
          {renderIcon(require('@/assets/icons/post/FindMusic.png'))}
          {renderText('music', '동영상')}
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handlePhotoPress}>
          {renderIcon(require('@/assets/icons/post/Picture.png'))}
          {renderText('photo', '이미지')}
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleTagPress}>
          {renderIcon(require('@/assets/icons/post/Tag.png'))}
          {renderText('tag', '태그')}
        </TouchableOpacity>
      </View>

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
