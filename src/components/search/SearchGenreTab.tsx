import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants';

const SearchGenreTab = () => {
  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
      {Array.from({ length: 3 }).map((_, sectionIdx) => (
        <View key={sectionIdx} style={styles.genreSection}>
          <Text style={styles.sectionTitle}>장르</Text>
          <View style={styles.keywordWrap}>
            {Array.from({ length: 4 }).map((_, i) => (
              <View key={i} style={styles.keyword}>
                <Text style={styles.keywordText}>해당 장르 키워드</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
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
  genreSection: {
    marginVertical: 16,
  },
  keywordWrap: {
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
    fontSize: 14,
    color: colors.GRAY_400,
  },
});

export default SearchGenreTab;
