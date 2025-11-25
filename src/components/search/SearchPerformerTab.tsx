import React from 'react';
import { ScrollView, View, Text, Dimensions, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { colors } from '@/constants';
import { useSearchPerformer } from '@/hooks/queries/search/useSearch';

const DEVICE_WIDTH = Dimensions.get('window').width;

type Props = {
  onSelect: (keyword: string) => void; // ✅ 추가
};


const SearchPerformerTab: React.FC<Props> = ({ onSelect }) => {

  const { data, isLoading, isError } = useSearchPerformer();

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
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16 }}>
      <Text style={styles.sectionTitle}>인기 검색어</Text>
      <View style={styles.container}>
        {data.map((performer, i) => (
          <TouchableOpacity key={i} style={styles.performerItem} activeOpacity={0.7} onPress={() => onSelect(performer.name)}>
            <Text style={styles.name}>{performer.name}</Text>
            <View style={styles.keywordRow}>
              {performer.keyword.map((kw, idx) => (
                <Text key={idx} style={styles.keyword}>
                  #{kw}
                </Text>
              ))}
            </View>
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
