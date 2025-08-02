import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
} from 'react-native';
import YouTubeEmbed from '../common/YouTubeEmbed';
import {colors} from '@/constants';
import {YouTubeVideo, DUMMY_YOUTUBE_VIDEOS} from '@/constants/types';

interface MusicSearchContentProps {
  onClose: () => void;
  onVideoSelect?: (video: YouTubeVideo) => void;
}

export default function MusicSearchContent({
  onClose,
  onVideoSelect,
}: MusicSearchContentProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] =
    useState<YouTubeVideo[]>(DUMMY_YOUTUBE_VIDEOS);

  const handleSearch = () => {
    // TODO: 실제 유튜브 API 검색 구현
    console.log('검색어:', searchQuery);
  };

  const handleVideoSelect = (video: YouTubeVideo) => {
    console.log('선택된 비디오:', video);
    onVideoSelect?.(video);
    onClose();
  };

  const handleClose = () => {
    setSearchQuery('');
    onClose();
  };

  // YouTube URL에서 비디오 ID 추출하는 함수
  const extractVideoId = (url: string) => {
    const regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : 'dQw4w9WgXcQ'; // 기본값
  };

  // 비디오 ID로부터 YouTube URL 생성
  const generateYouTubeUrl = (videoId: string) => {
    return `https://www.youtube.com/watch?v=${videoId}`;
  };

  const renderVideoItem = ({item}: {item: YouTubeVideo}) => (
    <TouchableOpacity
      style={styles.videoItem}
      onPress={() => handleVideoSelect(item)}>
      <View style={styles.videoThumbnail}>
        <YouTubeEmbed
          url={generateYouTubeUrl(extractVideoId(item.thumbnail))}
          showPlayButton={false}
          height={68}
          borderRadius={8}
        />
      </View>
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.videoDetailsContainer}>
          <Text style={styles.videoChannel}>{item.channel}</Text>
          <View style={styles.videoDot} />
          <Text style={styles.videoDuration}>{item.duration}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.title}>실시간 인기 클래식</Text>
      </View>

      {/* 검색바 */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Image
            source={require('@/assets/icons/post/Search.png')}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="어떤 클래식을 찾고있나요?"
            placeholderTextColor={colors.GRAY_400}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
        </View>
      </View>

      {/* 검색 결과 */}
      {searchQuery.trim() !== '' && (
        <View style={styles.resultsContainer}>
          <FlatList
            data={searchResults}
            renderItem={renderVideoItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{height: 20}} />}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 17,
    fontWeight: '900',
    lineHeight: 24,
    letterSpacing: 0.1,
    color: '#000000',
    fontFamily: 'Noto Sans KR',
  },
  searchContainer: {
    marginBottom: 24,
  },
  resultsContainer: {
    flex: 1,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.GRAY_100,
    borderRadius: 8,
    paddingHorizontal: 8,
    height: 44,
    gap: 8,
  },
  searchIcon: {
    width: 24,
    height: 24,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.2,
    color: '#000000',
    fontFamily: 'Noto Sans KR',
  },
  videoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    height: 80,
  },
  videoThumbnail: {
    width: 120,
    height: 68,
    borderRadius: 8,
    overflow: 'hidden',
  },
  videoInfo: {
    flex: 1,
    height: 68,
    justifyContent: 'center',
    gap: 4,
  },
  videoTitle: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 20,
    letterSpacing: 0.2,
    color: colors.BLACK,
    fontFamily: 'Noto Sans KR',
  },
  videoDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 18,
  },
  videoChannel: {
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.2,
    color: colors.GRAY_400,
    fontFamily: 'Noto Sans KR',
  },
  videoDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.GRAY_400,
  },
  videoDuration: {
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.2,
    color: colors.GRAY_400,
    fontFamily: 'Noto Sans KR',
  },
});
