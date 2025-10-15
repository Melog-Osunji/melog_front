import React, {useMemo} from 'react';
import { ScrollView, View, Text, StyleSheet, ActivityIndicator, Image, TouchableOpacity} from 'react-native';
import { colors } from '@/constants';
import { useSearchInstrument } from '@/hooks/queries/search/useSearch';

type Props = {
  onSelect: (keyword: string) => void; // ✅ 추가
};


const SearchInstrumentTab: React.FC<Props> = ({ onSelect }) => {

  const { data, isLoading, isError } = useSearchInstrument();

  const instruments = useMemo(() => {
      if (!data) return [];
      return data.instrument.map((name, i) => ({
        name,
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

  if (isError || !data) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: colors.GRAY_400 }}>데이터를 불러오지 못했습니다.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16 }}>
      <Text style={styles.sectionTitle}>인기 검색어</Text>
      <View style={styles.keywordWrap}>
        {instruments.map((item, i) => (
          <TouchableOpacity key={i} style={styles.keyword} activeOpacity={0.7} onPress={() => onSelect(item.name)}>
            <Image
              source={{ uri: item.image }}
              style={styles.circle}
              resizeMode="cover"
            />
            <Text style={styles.keywordText}>{item.name}</Text>
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
