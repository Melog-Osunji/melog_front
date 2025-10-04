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
}

export default function RecommendTags({
  visible,
  selectedTags,
  onTagSelect,
}: RecommendTagsProps) {
  // 사용 가능한 태그들
  const availableTags = [
    '드뷔시',
    '바흐',
    '쇼팽',
    '모차르트',
    '베토벤',
    '클래식',
    '피아노',
    '바이올린',
    '첼로',
    '오케스트라',
  ];

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.content}>
        {availableTags.map((tag, index) => (
          <TouchableOpacity
            key={index}
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
