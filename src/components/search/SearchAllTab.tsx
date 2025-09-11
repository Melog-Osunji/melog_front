import React from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { colors } from '@/constants';

const recommend = ['바이올린콩쿨', '퐁티', '브람스', '안달루시아', '파가니니'];
const popluarText = [
  '쇼팽 녹턴 명곡 모음',
  '모차르트 교향곡 40번',
  '클래식 입문 추천',
  '바흐 평균율',
  '라흐마니노프 협주곡 2번',
  '힐링 클래식 모음',
  '사계 비발디',
  '말러 교향곡 5번',
  '카페에서 듣기 좋은',
  '유튜브 클래식 베스트',
];

const SearchAllTab = () => {
  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16 }}>
      <View style={styles.firstView}>
        <Text style={styles.sectionTitle}>추천 키워드</Text>
        <View style={styles.keywordWrap}>
          {recommend.map((keyword, i) => (
            <Text key={i} style={styles.keyword}>
              <Text style={styles.sharp}># </Text>
              {keyword}
            </Text>
          ))}
        </View>
      </View>

      <View style={styles.secondView}>
        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>실시간 인기 검색어</Text>
          <Text style={styles.updateText}>2025.08.07 기준 업데이트</Text>
        </View>

        <View style={styles.popularWrap}>
          {popluarText.map((keyword, i) => (
            <View key={i} style={styles.popularRow}>
              <Text style={styles.rankText}>{i + 1}</Text>
              <Text style={styles.contentText}>{keyword}</Text>
            </View>
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
