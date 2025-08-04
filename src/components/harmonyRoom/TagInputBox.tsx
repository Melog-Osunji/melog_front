import React, { useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import {colors} from '@/constants';

interface TagInputBoxProps {
  tags: string[];
  setTags: (tags: string[]) => void;
}

const TagInputBox = ({ tags, setTags }: TagInputBoxProps) => {
  const [inputText, setInputText] = React.useState('');
  const inputRef = useRef<TextInput>(null);

  const handleAddTag = () => {
    const newTag = inputText.trim();
    if (newTag.length > 0 && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
    }
    setInputText('');
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.inputWrapper}
      onPress={() => inputRef.current?.focus()}>
      <View style={styles.tagRow}>
        {tags.map((tag, idx) => (
          <View style={styles.tag} key={idx}>
            <Text style={styles.tagText}><Text style={styles.sharpText}>#</Text> {tag}</Text>
          </View>
        ))}
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder={tags.length === 0 ? '태그를 달면 사람들이 더 쉽게 찾아요' : ''}
          placeholderTextColor={colors.GRAY_400}
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleAddTag}
          returnKeyType="done"
          onKeyPress={({ nativeEvent }) => {
            if (nativeEvent.key === 'Backspace' && inputText === '' && tags.length > 0) {
              setTags(tags.slice(0, tags.length - 1));
            }
          }}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    borderWidth: 1,
    borderColor: colors.GRAY_200,
    borderRadius: 8,
    padding: 8,
    minHeight: 44,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  tag: {
    backgroundColor: colors.BLUE_300,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    marginRight: 8,
    marginBottom:4,
  },
  tagText: {
    color:colors.BLUE_800,
    fontWeight:'500',
    fontSize:14,
    lineHeight:20,
    letterSpacing:0.2,
  },
  sharpText:{
    color:colors.BLUE_500,
    fontWeight:'500',
    fontSize:14,
    lineHeight:20,
    letterSpacing:0.2,
  },
  input: {
    minWidth: 80,
    flex: 1,
    padding: 0,
    color:colors.GRAY_400,
    fontWeight:'500',
    fontSize:14,
    lineHeight:20,
    letterSpacing:0.2,
  },
});

export default TagInputBox;
