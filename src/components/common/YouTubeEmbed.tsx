// YouTubeEmbed.tsx
import {colors} from '@/constants';
import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Image,
  Text,
} from 'react-native';

const extractYouTubeVideoId = (url: string): string | null => {
  const regex =
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

const YouTubeEmbed = ({
  url,
  showPlayButton = true,
  height = 200,
  borderRadius = 8,
}: {
  url: string;
  showPlayButton?: boolean;
  height?: number;
  borderRadius?: number;
}) => {
  const videoId = extractYouTubeVideoId(url);

  if (!videoId) return null;

  // YouTube 썸네일 URL 생성
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  // YouTube 앱 또는 브라우저로 열기
  const handlePress = () => {
    Linking.openURL(url);
  };

  return (
    <TouchableOpacity
      style={[styles.container, {height, borderRadius}]}
      onPress={handlePress}>
      <Image source={{uri: thumbnailUrl}} style={styles.thumbnail} />
      {showPlayButton && (
        <View style={styles.overlay}>
          <View style={styles.playButton}>
            <Text style={styles.playIcon}>▶</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default YouTubeEmbed;

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: colors.GRAY_400,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 30,
    backgroundColor: 'rgba(2, 2, 2, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.BLACK,
    // elevation: 20,
  },
  playIcon: {
    fontSize: 24,
    color: colors.WHITE,
    paddingBottom: 5, // 시각적 중앙 정렬을 위해
    paddingLeft: 3, // 시각적 중앙 정렬을 위해
  },
});
