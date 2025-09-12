import React from 'react';
import { TouchableOpacity, FlatList, Text, View, StyleSheet } from 'react-native';
import { colors } from '@/constants';

interface Props {
  suggestions: string[];
  searchText: string;
  onSelect: (text: string) => void;
}

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const AutoCompleteList: React.FC<Props> = ({ suggestions, searchText, onSelect }) => {
  const renderHighlightedText = (text: string) => {
    if (!searchText) return <Text style={styles.suggestionText}>{text}</Text>;

    const pattern = new RegExp(`(${escapeRegExp(searchText)})`, 'i');
    const parts = text.split(pattern);

    return (
      <Text style={styles.suggestionText}>
        {parts.map((part, idx) => (
          <Text key={`${part}-${idx}`} style={pattern.test(part) ? styles.highlightText : styles.normalText}>
            {part}
          </Text>
        ))}
      </Text>
    );
  };

  return (
    <View style={styles.listContainer}>
      <FlatList
        data={suggestions}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.suggestionItem} onPress={() => onSelect(item)}>
            {renderHighlightedText(item)}
          </TouchableOpacity>
        )}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    width: '100%',
  },
  suggestionItem: {
    paddingVertical: 12,
  },
  suggestionText: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.GRAY_600,
  },
  normalText: {
    color: colors.GRAY_600,
  },
  highlightText: {
    color: colors.BLUE_500,
  },
});

export default AutoCompleteList;
