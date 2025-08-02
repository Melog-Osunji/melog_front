import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity, FlatList } from 'react-native';
import { colors } from '@/constants';

interface Props {
  suggestions: string[];
  searchText: string;
  onSelect: (text: string) => void;
}

const AutoCompleteList: React.FC<Props> = ({ suggestions, searchText, onSelect }) => {
    const renderHighlightedText = (text: string) => {
        if (!searchText) return <SuggestionText>{text}</SuggestionText>;

        const regex = new RegExp(`(${searchText})`, 'i');
        const parts = text.split(regex);

        return (
          <SuggestionText>
            {parts.map((part, index) => (
              regex.test(part) ? (
                <HighlightText key={index}>{part}</HighlightText>
              ) : (
                <NormalText key={index}>{part}</NormalText>
              )
            ))}
          </SuggestionText>
        );
      };

  return (
      <ListContainer>
        <FlatList
          data={suggestions}
          keyExtractor={(item, index) => `${item}-${index}`}
          renderItem={({ item }) => (
            <SuggestionItem onPress={() => onSelect(item)}>
              {renderHighlightedText(item)}
            </SuggestionItem>
          )}
          keyboardShouldPersistTaps="handled"
        />
      </ListContainer>
    );
};

const ListContainer = styled.View`
  width: 100%;
`;

const SuggestionItem = styled(TouchableOpacity)`
  padding: 12px 0px;
`;


const SuggestionText = styled.Text`
  font-size: 15px;
  line-height:22px;
  color: ${colors.GRAY_600};
  flex-direction: row;
  flex-wrap: wrap;
`;

const NormalText = styled.Text`
  color: ${colors.GRAY_600};
`;

const HighlightText = styled.Text`
  color: ${colors.BLUE_500};
`;
export default AutoCompleteList;
