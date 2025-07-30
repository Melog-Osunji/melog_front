import React from 'react';
import { ScrollView } from 'react-native';
import styled from 'styled-components/native';

const SearchInstrumentTab = () => {
  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16 }}>
      <SectionTitle>인기 검색어</SectionTitle>
      <KeywordWrap>
        {Array.from({ length: 9 }).map((_, i) => (
          <Keyword key={i}>
            <Circle />
            악기
          </Keyword>
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
  flex-direction: row;
  text-align-vertical: center;
`;

const Circle = styled.View`
  width: 16px;
  height: 16px;
  background-color: #cfcfcf;
  border-radius: 8px;
  margin-right: 6px;
  display: inline-block;
`;

export default SearchInstrumentTab;
