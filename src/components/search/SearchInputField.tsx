import React, { useState } from 'react';
import { TextInput, View, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { colors } from '@/constants';
import SearchIcon from '@/assets/icons/post/Search.png';
import DeletIcon from '@/assets/icons/post/Delet.png';
import { Image } from 'react-native';
import IconButton from '@/components/IconButton';


interface InputFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

const SearchInputField: React.FC<InputFieldProps> = ({ value, onChangeText, placeholder,onFocus, onBlur, }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Container>
      <SearchImage source={SearchIcon} />

      <StyledInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.GRAY_300}
        onFocus={onFocus}
        onBlur={onBlur}
      />

      {value.length > 0 && (
        <ClearButton onPress={() => onChangeText('')}>
          <Image source={DeletIcon} style={{ width: 24, height: 24 }} />
        </ClearButton>
      )}
    </Container>
  );
};

const Container = styled.View`
  width: 90%;
  height:44px;
  flex-direction: row;
  align-items: center;
  background-color: ${colors.GRAY_100};
  border-radius: 12px;
  padding: 0px 8px;
`;

const StyledInput = styled.TextInput`
  flex: 1;
  font-size: 15px;
  color: ${colors.GRAY_600};
  padding-left: 8px;
`;

const SearchImage = styled.Image`
  width: 24px;
  height: 24px;
`;

const ClearButton = styled.TouchableOpacity`
`;


export default SearchInputField;
