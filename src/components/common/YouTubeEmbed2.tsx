// YouTubeEmbed2.tsx - 일반 YouTube 임베드
import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {WebView} from 'react-native-webview';

const {width: screenWidth} = Dimensions.get('window');

const extractYouTubeVideoId = (url: string): string | null => {
  const regex =
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

const YouTubeEmbed2 = ({
  url,
  borderRadius = 8,
}: {
  url: string;
  borderRadius?: number;
}) => {
  const videoId = extractYouTubeVideoId(url);

  if (!videoId) return null;

  // 기본 YouTube 임베드 URL (커스터마이징 없음)
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  // 16:9 비율로 높이 계산
  const videoHeight = (screenWidth / 16) * 9;

  return (
    <View style={[styles.container, {borderRadius, height: videoHeight}]}>
      <WebView
        source={{uri: embedUrl}}
        style={styles.webview}
        allowsFullscreenVideo
        javaScriptEnabled
      />
    </View>
  );
};

export default YouTubeEmbed2;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
  },
});
