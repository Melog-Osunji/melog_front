import React, { useMemo } from 'react';
import { ScrollView, View, Image, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { colors } from '@/constants';
import { useSearchComposer } from '@/hooks/queries/search/useSearch';

type Props = {
  onSelect: (keyword: string) => void; // ✅ 추가
};


const SearchComposerTab: React.FC<Props> = ({ onSelect }) => {

  const { data, isLoading, isError } = useSearchComposer();

  const composers = useMemo(() => {
      if (!data) return [];
      return data.name.map((n, i) => ({
        name: n,
        image: data.imgLink[i] ?? '',
      }));
  }, [data]);

  if (isLoading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator />
          <Text style={{ marginTop: 8, color: colors.GRAY_400 }}>불러오는 중…</Text>
        </View>
      );
    }

  if (isError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: colors.GRAY_400 }}>데이터를 불러오지 못했습니다.</Text>
        </View>
      );
  }

  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16, flexGrow: 1 }}>
      <Text style={styles.sectionTitle}>인기 검색어</Text>
      <View style={styles.gridWrap}>
        {composers.map((composer, idx) => (
          <TouchableOpacity key={idx} style={styles.gridItem} activeOpacity={0.7} onPress={() => onSelect(composer.name)}>
            <Image source={{ uri: composer.image }} style={styles.circleImage} resizeMode="cover" />
            <Text style={styles.name}>{composer.name}</Text>
          </TouchableOpacity>
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
  gridWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridItem: {
    alignItems: 'center',
    marginBottom: 24,
  },
  circleImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'lightgray',
    marginBottom: 12,
  },
  name: {
    color: colors.GRAY_600,
  },
});

export default SearchComposerTab;
