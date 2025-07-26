// YouTubeEmbed.tsx
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';

const extractYouTubeVideoId = (url: string): string | null => {
  const regex =
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

const YouTubeEmbed = ({url}: {url: string}) => {
  const videoId = extractYouTubeVideoId(url);

  if (!videoId) return null;

  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  return (
    <View style={styles.container}>
      <WebView
        source={{uri: embedUrl}}
        style={styles.webview}
        allowsFullscreenVideo
        javaScriptEnabled
      />
    </View>
  );
};

export default YouTubeEmbed;

const styles = StyleSheet.create({
  container: {
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
  },
});
