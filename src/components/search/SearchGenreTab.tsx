import React from 'react';
import { ScrollView, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '@/constants';
import { useSearchGenre } from '@/hooks/queries/search/useSearch';

const SearchGenreTab = () => {
  const { data, isLoading, isError } = useSearchGenre();

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
    <ScrollView style={{ flex: 1 }}
                  contentContainerStyle={{ paddingHorizontal: 20 }}>
      {data.map((section, sectionIdx) => (
          <View key={sectionIdx} style={styles.genreSection}>
            <Text style={styles.sectionTitle}>{section.genre}</Text>
            <View style={styles.keywordWrap}>
              {section.keyword.map((kw, i) => (
                <View key={i} style={styles.keyword}>
                  <Text style={styles.keywordText}>{kw}</Text>
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
