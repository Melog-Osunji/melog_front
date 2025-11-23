import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Keyboard,
} from 'react-native';
import BottomSheet from '@/components/common/BottomSheet';
import YouTubeEmbed from '@/components/common/YouTubeEmbed';
import {colors} from '@/constants';
import {useYoutubeSearch} from '@/hooks/queries/common/useCommonQueries';
import type {YouTubeVideoParsed, YouTubeVideo} from '@/types';
import {mapParsedToYouTubeVideo} from '@/utils/mappers/youtubeMapper';

interface MusicSearchBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onVideoSelect?: (video: YouTubeVideo) => void;
}

export default function MusicSearchBottomSheet({
  visible,
  onClose,
  onVideoSelect,
}: MusicSearchBottomSheetProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<YouTubeVideoParsed[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const youtubeSearch = useYoutubeSearch();

  const handleSearch = async () => {
    const term = searchQuery.trim();
    if (!term) {
      setSearchResults([]);
      return;
    }
    setIsLoading(true);
    try {
      const results = await youtubeSearch(term);
      setSearchResults(results ?? []);
      Keyboard.dismiss();
    } catch (err) {
      console.error('youtube search error', err);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoSelect = (videoParsed: YouTubeVideoParsed) => {
    const mapped = mapParsedToYouTubeVideo(videoParsed); // 전달 이전 변환 (YouTubeVideo로 변환)
    onVideoSelect?.(mapped);
    setSearchQuery('');
    setSearchResults([]);
  };

  const renderVideoItem = ({item}: {item: YouTubeVideoParsed}) => (
    <TouchableOpacity
      style={styles.videoItem}
      onPress={() => handleVideoSelect(item)}>
      <View style={styles.videoThumbnail}>
        <YouTubeEmbed
          url={item.url}
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
          <Text style={styles.videoChannel}>{/* 채널 정보 없음 */}</Text>
          <View style={styles.videoDot} />
          <Text style={styles.videoDuration}>{/* duration 없음 */}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      height="95%"
      handleTriggerHeight={10}>
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
              placeholderTextColor={colors.GRAY_300}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
              blurOnSubmit={true}
            />
          </View>
        </View>

        {/* 검색 결과 */}
        {searchQuery.trim() !== '' && (
          <View style={styles.resultsContainer}>
            <FlatList
              data={searchResults}
              renderItem={renderVideoItem}
              keyExtractor={item => item.url}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={{height: 20}} />}
              ListEmptyComponent={() => (
                <View style={{paddingTop: 20}}>
                  {isLoading ? (
                    <Text style={{color: colors.GRAY_400}}>검색중...</Text>
                  ) : (
                    <Text style={{color: colors.GRAY_400}}>
                      검색 결과가 없습니다.
                    </Text>
                  )}
                </View>
              )}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled={false}
            />
          </View>
        )}
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
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
