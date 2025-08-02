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
            <Text
              style={[
                styles.tagText,
                selectedTags.includes(tag) && styles.selectedTagText,
              ]}>
              #{tag}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: colors.BLUE_200,
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY_200,
  },
  scrollView: {
    flexGrow: 0,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  selectedTagItem: {
    backgroundColor: '#E8F4F8',
    borderColor: '#155B7E',
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8C9CAA',
  },
  selectedTagText: {
    color: '#155B7E',
  },
});
