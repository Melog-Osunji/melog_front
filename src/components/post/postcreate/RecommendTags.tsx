import {colors} from '@/constants';
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

interface RecommendTagsProps {
  visible: boolean;
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
  suggestions?: string[]; // 추가: 자동완성 제안
}

export default function RecommendTags({
  visible,
  selectedTags,
  onTagSelect,
  suggestions = [],
}: RecommendTagsProps) {
  // 사용 가능한 태그들 (기본)
  const baseTags = ['-'];

  if (!visible) return null;

  // suggestions를 우선으로, 중복 제거하여 표시
  const merged = [
    ...Array.from(new Set([...(suggestions || []), ...baseTags])),
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="always">
        {merged.map((tag, index) => (
          <TouchableOpacity
            key={`${tag}-${index}`}
            style={[
              styles.tagItem,
              selectedTags.includes(tag) && styles.selectedTagItem,
            ]}
            onPress={() => onTagSelect(tag)}>
            <Text style={{color: colors.BLUE_600}}>#</Text>
            <Text
              style={[
                styles.tagText,
                {color: colors.BLACK},
                selectedTags.includes(tag) && styles.selectedTagText,
              ]}>
              {tag}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    marginBottom: 2,
    backgroundColor: colors.WHITE,
  },
  scrollView: {
    flexGrow: 0,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    gap: 10,
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.BLUE_300,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8C9CAA',
  },
  selectedTagItem: {},
  selectedTagText: {}, //현재는 스타일 없음
});
