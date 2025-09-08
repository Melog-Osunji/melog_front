import React from 'react';
import { colors } from '@/constants';
import { Text, TouchableOpacity, Image, ScrollView, View, StyleSheet } from 'react-native';
import DeleteButton from '@/assets/icons/post/Delete.png';

interface Props {
  keywords: string[];
  onClearOne: (keyword: string) => void;
  onClearAll: () => void;
}

const RecentSearchList: React.FC<Props> = ({ keywords, onClearOne, onClearAll }) => {
  return (
    <ScrollView>
      <View style={styles.row}>
        <Text style={styles.sectionTitle}>최근 검색어</Text>
        <TouchableOpacity onPress={onClearAll}>
          <Text style={styles.clearAllText}>전체삭제</Text>
        </TouchableOpacity>
      </View>

      {keywords.map((keyword, i) => (
        <View key={`${keyword}-${i}`} style={styles.itemRow}>
          <Text style={styles.keywordText}>{keyword}</Text>
          <TouchableOpacity onPress={() => onClearOne(keyword)}>
            <Image source={DeleteButton} style={{ width: 24, height: 24 }} resizeMode="contain" />
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.GRAY_600,
  },
  clearAllText: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.GRAY_400,
  },
  itemRow: {
    width: '100%',
    height: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  keywordText: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.GRAY_600,
  },
});

export default RecentSearchList;
