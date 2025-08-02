import React from 'react';
import { ScrollView, Text } from 'react-native';
import styled from 'styled-components/native';
import {colors} from '@/constants';

const SearchAllTab = () => {
  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16, }}>
      <FirstView>
          <SectionTitle>추천 키워드</SectionTitle>
          <KeywordWrap>
            {Array.from({ length: 5 }).map((_, i) => (
                <Keyword key={i}><Sharp># </Sharp>키워드</Keyword>
            ))}
          </KeywordWrap>
      </FirstView>

      <SecondView>
          <RowBetween>
            <SectionTitle>실시간 인기 검색어</SectionTitle>
            <UpdateText>2025.00.00 기준 업데이트</UpdateText>
          </RowBetween>

          <PopularWrap>
          {Array.from({ length: 9 }).map((_, i) => (
            <PopularRow key={i}>
              <RankText>{i + 1}</RankText>
              <ContentText>인기 검색어</ContentText>
            </PopularRow>
          ))}
          </PopularWrap>
      </SecondView>
    </ScrollView>
  );
};

const FirstView = styled.View`
  padding : 0px 0px 24px 0px;
  flex-direction: column;
  gap:16px;
`;

const SectionTitle = styled.Text`
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 10px;
  color: ${colors.GRAY_600};
`;

const KeywordWrap = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap:8px;
`;

const Sharp = styled.Text`
  color: ${colors.BLUE_500};
  font-size: 14px;
`;

const Keyword = styled.Text`
  background-color: #d6eef8;
  padding: 8px 16px;
  border-radius: 20px;
  color: ${colors.BLUE_800};
  font-size: 14px;
`;

const SecondView = styled.View`
  padding : 16px 0px 0px 0px;
  flex-direction: column;
  gap:24px;
`;

const RowBetween = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const UpdateText = styled.Text`
  font-size: 11px;
  color: ${colors.GRAY_300};
`;

const PopularWrap = styled.View`
    flex-direction: colum;
    gap: 12px;
    paddingHorizontal:8px;
`;

const PopularRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 16px;
`;

const RankText = styled.Text`
  color: ${colors.BLUE_500};
  font-size:16px;
  font-weight:600;
  line-height:28px;
`;

const ContentText = styled.Text`
  color: ${colors.GRAY_600};
  font-size:14px;
  font-weight:400;
  line-height:20px;
`;

export default SearchAllTab;
