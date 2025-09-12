import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants';

const SearchInstrumentTab = () => {
  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16 }}>
      <Text style={styles.sectionTitle}>인기 검색어</Text>
      <View style={styles.keywordWrap}>
        {Array.from({ length: 7 }).map((_, i) => (
          <View key={i} style={styles.keyword}>
            <View style={styles.circle} />
            <Text style={styles.keywordText}>악기</Text>
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
  keywordWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  keyword: {
    paddingTop: 8,
    paddingRight: 16,
    paddingBottom: 8,
    paddingLeft: 8,
    backgroundColor: colors.GRAY_100,
    borderRadius: 60,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keywordText: {
    fontSize: 15,
    color: colors.GRAY_400,
  },
  circle: {
    width: 32,
    height: 32,
    backgroundColor: '#cfcfcf',
    borderRadius: 100,
  },
});

export default SearchInstrumentTab;
