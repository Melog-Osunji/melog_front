import React from 'react';
import { ScrollView, View, Text, Dimensions, StyleSheet } from 'react-native';
import { colors } from '@/constants';

const DEVICE_WIDTH = Dimensions.get('window').width;
const performers = Array.from({ length: 6 }).map((_, i) => `이름 ${i}`);

const SearchPerformerTab = () => {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16 }}>
      <Text style={styles.sectionTitle}>인기 검색어</Text>
      <View style={styles.container}>
        {performers.map((name, i) => (
          <View key={i} style={styles.performerItem}>
            <Text style={styles.name}>{name}</Text>
            <View style={styles.keywordRow}>
              <Text style={styles.keyword}>#관련 키워드</Text>
              <Text style={styles.keyword}>#관련 키워드</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 28,
    color: colors.GRAY_600,
  },
  container: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 12,
    width: DEVICE_WIDTH,
  },
  performerItem: {
    paddingVertical: 12,
    width: '100%',
    flexDirection: 'column',
    gap: 12,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22,
    color: colors.GRAY_600,
  },
  keywordRow: {
    flexDirection: 'row',
    gap: 8,
  },
  keyword: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.BLUE_500,
  },
});

export default SearchPerformerTab;
