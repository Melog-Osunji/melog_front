import React, { useMemo, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '@/constants';

const TagInputBox = ({ tags, setTags, allKeywords = [], maxTags = 3 }) => {
  const [inputText, setInputText] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const atLimit = tags.length >= maxTags;

  const suggestions = useMemo(() => {
    const q = inputText.trim();
    if (!q) return [];
    return allKeywords
      .filter(k => k.includes(q))
      .filter(k => !tags.includes(k))
      .slice(0, 3);
  }, [inputText, allKeywords, tags]);

  const canAdd =
    inputText.trim().length > 0 &&
    !tags.includes(inputText.trim()) &&
    !atLimit;

  const addTag = () => {
    if (!canAdd) return;
    setTags([...tags, inputText.trim()]);
    setInputText('');
    inputRef.current?.focus();
  };

  // 🔥 태그 클릭 → 수정 모드 진입
  const editTag = (tag: string) => {
    setInputText(tag);                     // 입력창에 옮기기
    setTags(tags.filter(t => t !== tag));  // 기존 태그 제거
    inputRef.current?.focus();
  };

  return (
    <View>
      <View style={[styles.inputWrapper, focused && styles.inputWrapperFocused]}>
        <View style={styles.rowLeft}>

          {tags.map((tag, idx) => (
            <TouchableOpacity
              key={`${tag}-${idx}`}
              onPress={() => editTag(tag)}
              style={styles.addedTag}
              activeOpacity={0.7}
            >
              <Text style={styles.addedTagText}>
                <Text style={styles.hashMuted}>#</Text> {tag}
              </Text>
            </TouchableOpacity>
          ))}

          <Text style={styles.hash}>#</Text>

          <TextInput
            ref={inputRef}
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="태그 입력"
            placeholderTextColor={colors.GRAY_400}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            returnKeyType="done"
            blurOnSubmit={false}
          />
        </View>

        <TouchableOpacity
          onPress={addTag}
          disabled={!canAdd}
          style={[styles.addBtn, !canAdd && styles.addBtnDisabled]}
        >
          <Text style={[styles.addBtnText, !canAdd && styles.addBtnTextDisabled]}>
            추가
          </Text>
        </TouchableOpacity>
      </View>

      {inputText.trim().length > 0 && suggestions.length > 0 && (
        <View style={styles.suggestRow}>
          {suggestions.map((s, i) => (
            <TouchableOpacity
              key={`${s}-${i}`}
              onPress={() => setInputText(s)}
              style={styles.suggestTag}
            >
              <Text style={styles.suggestText}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {atLimit && (
        <Text style={styles.limitText}>
          카테고리는 최대 {maxTags}개까지 가능해요.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    borderRadius: 8,
    paddingHorizontal: 11,
    paddingVertical: 8,
    backgroundColor: colors.GRAY_100,
    borderWidth: 1,
    borderColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWrapperFocused: {
    borderColor: colors.BLUE_400,
  },
  rowLeft: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    alignItems: 'center',
  },
  hash: {
    color: colors.GRAY_500,
    fontSize: 14,
  },
  input: {
    flexGrow: 1,
    minWidth: 50,
    padding: 0,
    fontSize: 14,
    color: colors.GRAY_600,
  },

  addedTag: {
    backgroundColor: colors.WHITE,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  addedTagText: {
    fontSize: 12,
    color: colors.GRAY_600,
  },
  hashMuted: {
    color: colors.BLUE_500,
  },

  addBtn: {
    width: 57,
    height: 28,
    backgroundColor: colors.BLUE_300,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnDisabled: {
    backgroundColor: colors.GRAY_200,
  },
  addBtnText: {
    color: colors.BLUE_600,
    fontSize: 14,
    fontWeight: '500',
  },
  addBtnTextDisabled: {
    color: colors.GRAY_300,
  },

  suggestRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 8,
  },
  suggestTag: {
    backgroundColor: colors.BLUE_300,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  suggestText: {
    color: colors.BLUE_800,
    fontSize: 12,
  },

  limitText: {
    marginTop: 8,
    fontSize: 12,
    color: colors.ERROR_RED,
  },
});

export default TagInputBox;
