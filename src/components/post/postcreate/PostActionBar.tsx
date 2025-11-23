import React, {useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import {colors} from '@/constants';
import RecommendTags from './RecommendTags';
import {YouTubeVideo} from '@/types';

interface PostActionButtonsProps {
  onVideoSelect?: (video: YouTubeVideo) => void;
  onTagSelect?: (tag: string) => void;
  onImageSelect?: () => void;
  onOpenMusicSheet?: () => void;
  selectedTags?: string[];
  hasMediaSelected?: boolean;
  forceShowTagBar?: boolean; // 추가: 부모에서 강제로 태그바 표시
  suggestedTags?: string[]; // 추가: 자동완성 결과 전달
}

export default function PostActionButtons({
  onTagSelect,
  onImageSelect,
  onOpenMusicSheet,
  selectedTags = [],
  hasMediaSelected = false,
  forceShowTagBar = false,
  suggestedTags = [],
}: PostActionButtonsProps) {
  const [showTagBar, setShowTagBar] = useState(false);

  // 상위에서 관리
  React.useEffect(() => {
    setShowTagBar(forceShowTagBar);
  }, [forceShowTagBar]);

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
        suggestions={suggestedTags} // 전달
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

        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowTagBar(!showTagBar)}>
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
    width: '100%',
    zIndex: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
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
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 20,
    letterSpacing: 0.2,
    color: colors.GRAY_300,
  },
  musicButtonText: {
    color: '#155B7E',
  },
});
