// YouTubeEmbed2.tsx - 일반 YouTube 임베드
import React from 'react';
import {View, StyleSheet, Dimensions, Platform, Linking} from 'react-native';
import {WebView} from 'react-native-webview';
import {extractVideoId} from '@/utils';

const {width: screenWidth} = Dimensions.get('window');

const BUNDLE_HOST = 'com.melogapp'; // 실제 패키지명 / 번들 ID로 교체
const REFERER = `https://${BUNDLE_HOST}`;

type Props = {
  url: string;
  borderRadius?: number;
  height?: number;
};

const YouTubeEmbed2 = ({url, borderRadius = 8, height}: Props) => {
  const videoId = extractVideoId(url);
  if (!videoId) return null;

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&fs=1&cc_load_policy=0&controls=1&disablekb=0&origin=${encodeURIComponent(
    REFERER,
  )}`;

  const videoHeight = height || (screenWidth / 16) * 9;

  return (
    <View style={[styles.container, {borderRadius, height: videoHeight}]}>
      <WebView
        source={{
          uri: embedUrl,
          headers: {
            Referer: REFERER,
            'Referrer-Policy': 'strict-origin-when-cross-origin',
          },
        }}
        style={styles.webview}
        allowsFullscreenVideo
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState={false}
        cacheEnabled
        cacheMode="LOAD_CACHE_ELSE_NETWORK"
        androidLayerType="hardware"
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        mixedContentMode="compatibility"
        bounces={false}
        scrollEnabled={false}
        onShouldStartLoadWithRequest={() => true}
        onLoadStart={() => console.log('YouTube WebView load started')}
        onLoadEnd={() => console.log('YouTube WebView load ended')}
        onError={e => {
          console.log('YouTube WebView error: ', e.nativeEvent);
          // 폴백: 외부 브라우저/유튜브 앱에서 재생
          Linking.openURL(`https://youtu.be/${videoId}`).catch(() => {});
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
