import React, {useRef} from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {colors} from '@/constants';
import {showToast} from '@/components/common/ToastService';

export interface InputBoxProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  maxLength?: number;
  multiline?: boolean;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  showCount?: boolean;
  minHeight?: number;
}

function InputBox({
  value,
  onChangeText,
  placeholder = '',
  maxLength,
  multiline = false,
  style,
  inputStyle,
  showCount = false,
  minHeight = 0,
}: InputBoxProps) {
  const prevLenRef = useRef<number>(value?.length ?? 0);

  const handleChange = (text: string) => {
    // show toast once when reaching maxLength
    if (
      typeof maxLength === 'number' &&
      text.length >= maxLength &&
      prevLenRef.current < maxLength
    ) {
      showToast('최대 글자 수에 도달했습니다', 'error');
    }
    prevLenRef.current = text.length;
    onChangeText(text);
  };

  return (
    <View style={[styles.container, style]}>
      <TextInput
        value={value}
        onChangeText={handleChange}
        multiline={multiline}
        maxLength={maxLength}
        style={[styles.input, {minHeight}, inputStyle]}
        textAlignVertical="top"
        underlineColorAndroid="transparent"
        placeholder={undefined}
      />
      {value === '' && placeholder ? (
        <Text style={styles.placeholderText}>{placeholder}</Text>
      ) : null}
      {showCount && typeof maxLength === 'number' ? (
        <Text style={styles.counter}>{`${value.length}/${maxLength}`}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    backgroundColor: colors.GRAY_100,
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: 'relative',
  },
  input: {
    fontSize: 16,
    color: colors.BLACK,
    padding: 0,
  },
  placeholderText: {
    position: 'absolute',
    left: 12,
    top: 10,
    color: colors.GRAY_200,
    fontSize: 12,
    zIndex: 1,
    lineHeight: 24,
  },
  counter: {
    position: 'absolute',
    right: 12,
    bottom: 8,
    fontSize: 12,
    color: colors.GRAY_400,
  },
});

export default InputBox;
