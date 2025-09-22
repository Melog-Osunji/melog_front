import React, { useMemo, useRef, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/constants';

interface Props {
  tags: string[];
  setTags: (tags: string[]) => void;
  /** 전체 키워드 풀. 안 주면 기본값 사용 */
  allKeywords?: string[];
  /** 최대 개수 (디폴트 3) */
  maxTags?: number;
}

const DEFAULT_KEYWORDS = [
  '키워드', '키큰플레이리스트', '키스신OST', '키보드', '피아노', '현악', '관현악',
  '바흐', '베토벤', '모차르트', '쇼팽', '라흐마니노프', '낭만주의', '플레이리스트', '집중'
];

const TagInputBox: React.FC<Props> = ({ tags, setTags, allKeywords = DEFAULT_KEYWORDS, maxTags = 3 }) => {
  const [inputText, setInputText] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const atLimit = tags.length >= maxTags;

  const suggestions = useMemo(() => {
    const q = inputText.trim();
    if (!q) return [];
    // 포함 매칭 + 이미 추가된 태그 제외 + 상위 3개
    return allKeywords
      .filter(k => k.includes(q))
      .filter(k => !tags.includes(k))
      .slice(0, 3);
  }, [inputText, allKeywords, tags]);

  const canAdd =
    inputText.trim().length > 0 &&
    !tags.includes(inputText.trim()) &&
    tags.length < maxTags;

  const addTag = () => {
    if (!canAdd) return;
    setTags([...tags, inputText.trim()]);
    setInputText('');
    inputRef.current?.focus();
  };

  return (
    <View>
      {/* 입력 줄 */}
      <View style={[styles.inputWrapper, focused && styles.inputWrapperFocused]}>
        <View style={styles.rowLeft}>
          {/* 이미 추가된 태그들 (흰색 칩) */}
          {tags.map((tag, idx) => (
            <View style={styles.addedTag} key={`${tag}-${idx}`}>
              <Text style={styles.addedTagText}>
                <Text style={styles.hashMuted}>#</Text> {tag}
              </Text>
            </View>
          ))}

          {/* 고정 해시 + 입력창 */}
          <Text style={styles.hash}>#</Text>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholderTextColor={colors.GRAY_400}
            value={inputText}
            onChangeText={setInputText}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            // Enter로는 추가되지 않음(요구사항)
            onSubmitEditing={() => {}}
            returnKeyType="done"
            blurOnSubmit={false}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === 'Backspace' && inputText === '' && tags.length > 0) {
                // 입력이 비었을 때만 마지막 태그 제거(이전 UX 유지)
                setTags(tags.slice(0, tags.length - 1));
              }
            }}
          />
        </View>

        <TouchableOpacity
          onPress={addTag}
          disabled={!canAdd}
          style={[styles.addBtn, !canAdd && styles.addBtnDisabled]}
          activeOpacity={0.8}
        >
          <Text style={[styles.addBtnText, !canAdd && styles.addBtnTextDisabled]}>추가</Text>
        </TouchableOpacity>
      </View>

      {/* 추천 키워드 (입력 시에만 노출, 최대 3개) */}
      {inputText.trim().length > 0 && suggestions.length > 0 && (
        <View style={styles.suggestRow}>
          {suggestions.map((s, i) => (
            <TouchableOpacity
              key={`${s}-${i}`}
              onPress={() => setInputText(s)} // 탭하면 입력창에 채워지고, "추가"를 눌러야 실제 추가
              style={styles.suggestTag}
              activeOpacity={0.8}
            >
              <Text style={styles.suggestText}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* ✅ 최대 3개 채우면 안내 문구 */}
      {atLimit && (
        <Text style={styles.limitText}>카테고리는 최대 {maxTags}개까지 가능해요.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    borderRadius: 8,
    paddingHorizontal: 11,
    paddingVertical: 8,
    minHeight: 46,
    backgroundColor: colors.GRAY_100,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputWrapperFocused: {
    borderColor: colors.BLUE_400,
  },
  rowLeft: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6 as any, // RN gap polyfill용(없으면 무시)
  },
  hash: {
    color: colors.GRAY_500,
    fontSize: 14,
    lineHeight: 20,
  },
  hashMuted: {
    color: colors.BLUE_500,
    fontSize: 14,
  },
  input: {
    flexGrow: 1,
    minWidth: 80,
    padding: 0,
    color: colors.GRAY_600,
    fontSize: 14,
    lineHeight: 20,
  },

  // 추가된 태그(흰색)
  addedTag: {
    backgroundColor: colors.WHITE,
    paddingVertical: 4,
    paddingHorizontal: 10,
    gap: 4,
    borderRadius: 999,
    marginRight: 4,
  },
  addedTagText: {
    color: colors.GRAY_600,
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 20,
    letterSpacing: 0.2,
  },

  // 추천 칩
  suggestRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 4 as any,
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
    lineHeight: 16,
    letterSpacing: 0.2,
    fontWeight: '400',
  },

  // 추가 버튼
  addBtn: {
    width: 57,
    height: 28,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.BLUE_300,
  },
  addBtnText: {
    color: colors.BLUE_600,
    fontWeight: '500',
    fontSize: 14,
    letterSpacing: 0.2,
    lineHeight: 20,
  },
  addBtnDisabled: {
    backgroundColor: colors.GRAY_200,
  },
  addBtnTextDisabled: {
    color: colors.GRAY_100,
  },
  limitText: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 16,
    color: colors.ERROR_RED,
  },
});

export default TagInputBox;
