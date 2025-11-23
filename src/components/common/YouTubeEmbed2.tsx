// YouTubeEmbed2.tsx - 일반 YouTube 임베드
import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {WebView} from 'react-native-webview';
import {extractVideoId} from '@/utils';

const {width: screenWidth} = Dimensions.get('window');

const YouTubeEmbed2 = ({
  url,
  borderRadius = 8,
  height,
}: {
  url: string;
  borderRadius?: number;
  height?: number;
}) => {
  const videoId = extractVideoId(url);

  if (!videoId) return null;

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&iv_load_policy=3&fs=1&cc_load_policy=0&controls=1&disablekb=0`;

  // 16:9 비율로 높이 계산
  // height prop이 있으면 우선 사용
  const videoHeight = height || (screenWidth / 16) * 9;

  return (
    <View style={[styles.container, {borderRadius, height: videoHeight}]}>
      <WebView
        source={{uri: embedUrl}}
        style={styles.webview}
        allowsFullscreenVideo={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={false}
        cacheEnabled={true}
        cacheMode="LOAD_CACHE_ELSE_NETWORK"
        androidLayerType="hardware"
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        mixedContentMode="compatibility"
        bounces={false}
        scrollEnabled={false}
        onShouldStartLoadWithRequest={() => true}
        onLoadStart={() => console.log('YouTube WebView load started')}
        onLoadEnd={() => console.log('YouTube WebView load ended')}
        onError={syntheticEvent => {
          const {nativeEvent} = syntheticEvent;
          console.log('YouTube WebView error: ', nativeEvent);
        }}
      />
    </View>
  );
};

export default YouTubeEmbed2;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: '#000000',
  },
  webview: {
    flex: 1,
    backgroundColor: '#000000',
  },
});
