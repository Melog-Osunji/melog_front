import React from 'react';
import { ScrollView } from 'react-native';
import styled from 'styled-components/native';

const performers = Array.from({ length: 6 }).map((_, i) => `이름 ${i}`);

const SearchPerformerTab = () => {
  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16 }}>
      {performers.map((name, i) => (
        <PerformerItem key={i}>
          <Name>{name}</Name>
          <KeywordRow>
            <Keyword>#관련 키워드</Keyword>
            <Keyword>#관련 키워드</Keyword>
            <Keyword>#관련 키워드</Keyword>
          </KeywordRow>
        </PerformerItem>
      ))}
    </ScrollView>
  );
};

const PerformerItem = styled.View`
  margin-bottom: 20px;
`;

const Name = styled.Text`
  font-weight: bold;
  margin-bottom: 6px;
`;

const KeywordRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
`;

const Keyword = styled.Text`
  color: #007aff;
`;

export default SearchPerformerTab;
