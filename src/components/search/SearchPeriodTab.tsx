import React from 'react';
import { ScrollView, View, Text, Dimensions, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '@/constants';
import { useSearchPeriod } from '@/hooks/queries/search/useSearch';

const DEVICE_WIDTH = Dimensions.get('window').width;

const SearchPeriodTab = () => {

  const { data, isLoading, isError } = useSearchPeriod();

  if (isLoading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator />
          <Text style={{ marginTop: 8, color: colors.GRAY_400 }}>불러오는 중…</Text>
        </View>
      );
  }

  if (isError || !data) {
      return (
        <View style={styles.center}>
          <Text style={{ color: colors.GRAY_400 }}>데이터를 불러오지 못했습니다.</Text>
        </View>
      );
  }

  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16 }}>
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>인기 검색어</Text>
        <View style={styles.keywordWrap}>
          {data.era.map((item, i) => (
            <View key={i} style={styles.keyword}>
              <Text style={styles.keywordText}>{item}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 12,
    width: DEVICE_WIDTH,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 28,
    color: colors.GRAY_600,
  },
  keywordWrap: {
    width: DEVICE_WIDTH - 40,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 18,
  },
  keyword: {
    height: 48,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.GRAY_100,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keywordText: {
    fontSize: 15,
    color: colors.GRAY_400,
  },
});

export default SearchPeriodTab;
