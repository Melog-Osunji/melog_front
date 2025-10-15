import React from 'react';
import { ScrollView, Text, View, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { colors } from '@/constants';
import { useSearchAll } from '@/hooks/queries/search/useSearch';

type Props = {
  onSelect: (keyword: string) => void; // ✅ 추가
};

const SearchAllTab: React.FC<Props> = ({ onSelect }) => {
  const { data, isLoading, isError } = useSearchAll();

  if (isLoading) {
      return (
        <View style={{ paddingVertical: 32, alignItems: 'center' }}>
          <ActivityIndicator />
          <Text style={{ marginTop: 8, color: colors.GRAY_400 }}>불러오는 중…</Text>
        </View>
      );
    }

  if (isError || !data) {
      return (
        <View style={{ paddingVertical: 32, alignItems: 'center' }}>
          <Text style={{ color: colors.GRAY_400 }}>데이터를 불러오지 못했습니다.</Text>
        </View>
      );
    }

  const { recommendKeyword, livePopularSearch, nowTime } = data;

  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16 }}>
      <View style={styles.firstView}>
        <Text style={styles.sectionTitle}>추천 키워드</Text>
        <View style={styles.keywordWrap}>
          {recommendKeyword.map((keyword, i) => (
            <TouchableOpacity key={i} activeOpacity={0.7} onPress={() => onSelect(keyword)}>
                <Text key={i} style={styles.keyword}>
                  <Text style={styles.sharp}># </Text>
                  {keyword}
                </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.secondView}>
        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>실시간 인기 검색어</Text>
          <Text style={styles.updateText}>{nowTime} 기준 업데이트</Text>
        </View>

        <View style={styles.popularWrap}>
          {livePopularSearch.map((keyword, i) => (
            <TouchableOpacity key={i} style={styles.popularRow} activeOpacity={0.6} onPress={() => onSelect(keyword)}>
              <Text style={styles.rankText}>{i + 1}</Text>
              <Text style={styles.contentText}>{keyword}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  firstView: {
    paddingBottom: 24,
    flexDirection: 'column',
    gap: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 10,
    color: colors.GRAY_600,
  },
  keywordWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sharp: {
    color: colors.BLUE_500,
    fontSize: 14,
  },
  keyword: {
    backgroundColor: '#d6eef8',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    color: colors.BLUE_800,
    fontSize: 14,
  },
  secondView: {
    paddingTop: 16,
    flexDirection: 'column',
    gap: 24,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  updateText: {
    fontSize: 11,
    color: colors.GRAY_300,
  },
  popularWrap: {
    flexDirection: 'column',
    gap: 12,
    paddingHorizontal: 8,
  },
  popularRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  rankText: {
    color: colors.BLUE_500,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 28,
  },
  contentText: {
    color: colors.GRAY_600,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
});

export default SearchAllTab;
