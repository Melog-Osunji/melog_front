import React from 'react';
import { ScrollView } from 'react-native';
import styled from 'styled-components/native';

const SearchPeriodTab = () => {
  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16 }}>
      <SectionTitle>인기 검색어</SectionTitle>
      <KeywordWrap>
        {Array.from({ length: 6 }).map((_, i) => (
          <Keyword key={i}>텍스트</Keyword>
        ))}
      </KeywordWrap>
    </ScrollView>
  );
};

const SectionTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const KeywordWrap = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
`;

const Keyword = styled.Text`
  background-color: #eef4fa;
  padding: 8px 12px;
  border-radius: 20px;
`;

export default SearchPeriodTab;
