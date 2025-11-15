import React, {useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import {colors} from '@/constants';
import RecommendTags from './RecommendTags';
import {YouTubeVideo} from '@/types';

interface PostActionButtonsProps {
  onVideoSelect?: (video: YouTubeVideo) => void;
  onTagSelect?: (tag: string) => void;
  onImageSelect?: () => void;
  onOpenMusicSheet?: () => void; // 추가: 바텀시트 열기 요청
  selectedTags?: string[];
  hasMediaSelected?: boolean;
}

export default function PostActionButtons({
  onVideoSelect,
  onTagSelect,
  onImageSelect,
  onOpenMusicSheet,
  selectedTags = [],
  hasMediaSelected = false,
}: PostActionButtonsProps) {
  const [showTagBar, setShowTagBar] = useState(false);

  const handleTagSelect = (tag: string) => {
    onTagSelect?.(tag);
  };

  const handlePhotoPress = () => {
    onImageSelect?.();
  };

  const handleMusicPress = () => {
    // 부모에게 바텀시트 열기 요청
    onOpenMusicSheet?.();
  };

  const handleTagPress = () => {
    setShowTagBar(!showTagBar);
  };

  const renderIcon = (iconSource: any) => (
    <View style={styles.iconContainer}>
      <Image source={iconSource} style={styles.iconImage} />
    </View>
  );

  const renderText = (buttonType: 'music' | 'photo' | 'tag', label: string) => (
    <Text
      style={[
        styles.buttonText,
        buttonType === 'music' && styles.musicButtonText,
      ]}>
      {label}
    </Text>
  );

  return (
    <View style={styles.container}>
      <RecommendTags
        visible={showTagBar}
        selectedTags={selectedTags}
        onTagSelect={handleTagSelect}
      />

      <View style={styles.buttonContainer}>
        {!hasMediaSelected && (
          <>
            <TouchableOpacity style={styles.button} onPress={handleMusicPress}>
              {renderIcon(require('@/assets/icons/post/FindMusic.png'))}
              {renderText('music', '동영상')}
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handlePhotoPress}>
              {renderIcon(require('@/assets/icons/post/Picture.png'))}
              {renderText('photo', '이미지')}
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity style={styles.button} onPress={handleTagPress}>
          {renderIcon(require('@/assets/icons/post/Tag.png'))}
          {renderText('tag', '태그')}
        </TouchableOpacity>
      </View>
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
