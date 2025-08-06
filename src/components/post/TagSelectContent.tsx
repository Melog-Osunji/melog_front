import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {colors} from '@/constants';

interface TagSelectContentProps {
  onClose: () => void;
  onTagSelect?: (tag: string) => void;
}

const TAGS = [
  '클래식',
  '바로크',
  '로맨틱',
  '모던',
  '오페라',
  '심포니',
  '콘체르토',
  '소나타',
];

export default function TagSelectContent({
  onClose,
  onTagSelect,
}: TagSelectContentProps) {
  const handleTagPress = (tag: string) => {
    onTagSelect?.(tag);
    onClose();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>태그 선택</Text>
      </View>

      <View style={styles.tagContainer}>
        {TAGS.map((tag, index) => (
          <TouchableOpacity
            key={index}
            style={styles.tagButton}
            onPress={() => handleTagPress(tag)}>
            <Text style={styles.tagText}>#{tag}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
        <Text style={styles.cancelText}>취소</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 12,
  },
  tagButton: {
    backgroundColor: '#F0F8FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#155B7E',
  },
  tagText: {
    fontSize: 14,
    color: '#155B7E',
    fontWeight: '500',
  },
  cancelButton: {
    marginTop: 'auto',
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '500',
  },
});
