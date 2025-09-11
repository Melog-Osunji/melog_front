import React from 'react';
import { TextInput, View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { colors } from '@/constants';
import SearchIcon from '@/assets/icons/post/Search.png';
import DeletIcon from '@/assets/icons/post/Delet.png';

interface InputFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  onSubmitEditing?: () => void;
}

const SearchInputField: React.FC<InputFieldProps> = ({
  value,
  onChangeText,
  placeholder,
  onFocus,
  onBlur,
  onSubmitEditing,
}) => {
  return (
    <View style={styles.container}>
      <Image source={SearchIcon} style={styles.searchImage} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.GRAY_300}
        onFocus={onFocus}
        onBlur={onBlur}
        onSubmitEditing={onSubmitEditing}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={() => onChangeText('')}>
          <Image source={DeletIcon} style={{ width: 24, height: 24 }} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.GRAY_100,
    borderRadius: 12,
    paddingHorizontal: 8,
    marginLeft: 8,
  },
  searchImage: {
    width: 24,
    height: 24,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.GRAY_600,
    paddingLeft: 8,
  },
  clearButton: {},
});

export default SearchInputField;
