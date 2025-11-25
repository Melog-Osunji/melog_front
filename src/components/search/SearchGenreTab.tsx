import React from 'react';
import { ScrollView, View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { colors } from '@/constants';
import { useSearchGenre } from '@/hooks/queries/search/useSearch';


type Props = {
  onSelect: (keyword: string) => void; // ✅ 추가
};

const SearchGenreTab: React.FC<Props> = ({ onSelect }) => {
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: colors.GRAY_400 }}>데이터를 불러오지 못했습니다.</Text>
      </View>
    );
  }
  return (
    <ScrollView style={{ flex: 1 }}
                  contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16 }}>
      {data.map((section, sectionIdx) => (
          <View key={sectionIdx} style={styles.genreSection}>
            <Text style={styles.sectionTitle}>{section.genre}</Text>
            <View style={styles.keywordWrap}>
              {section.keyword.map((kw, i) => (
                <TouchableOpacity key={i} style={styles.keyword} activeOpacity={0.7} onPress={() => onSelect(kw)}>
                  <Text style={styles.keywordText}>{kw}</Text>
                </TouchableOpacity>
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
