import React from 'react';
import { ScrollView, Text } from 'react-native';
import styled from 'styled-components/native';

const SearchAllTab = () => {
  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16, }}>
      <SectionTitle>추천 키워드</SectionTitle>
      <KeywordWrap>
        {Array.from({ length: 8 }).map((_, i) => (
          <Keyword key={i}># 키워드</Keyword>
        ))}
      </KeywordWrap>

      <RowBetween>
        <SectionTitle>실시간 인기 검색어</SectionTitle>
        <UpdateText>2025.00.00 기준 업데이트</UpdateText>
      </RowBetween>

      {Array.from({ length: 9 }).map((_, i) => (
        <PopularRow key={i}>
          <RankText>{i + 1}</RankText>
          <Text>인기 검색어</Text>
        </PopularRow>
      ))}
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
  margin-bottom: 20px;
`;

const Keyword = styled.Text`
  background-color: #d6eef8;
  padding: 8px 12px;
  border-radius: 20px;
`;

const RowBetween = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const UpdateText = styled.Text`
  font-size: 12px;
  color: gray;
`;

const PopularRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-vertical: 4px;
`;

const RankText = styled.Text`
  color: #007aff;
  width: 20px;
`;

export default SearchAllTab;
