import React from 'react';
import { ScrollView, View, Text, Dimensions, StyleSheet } from 'react-native';
import { colors } from '@/constants';

const DEVICE_WIDTH = Dimensions.get('window').width;

const SearchPeriodTab = () => {
  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16 }}>
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>인기 검색어</Text>
        <View style={styles.keywordWrap}>
          {Array.from({ length: 6 }).map((_, i) => (
            <View key={i} style={styles.keyword}>
              <Text style={styles.keywordText}>키워드</Text>
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
    width: 294,
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
