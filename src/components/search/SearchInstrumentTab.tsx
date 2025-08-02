import React from 'react';
import { ScrollView } from 'react-native';
import styled from 'styled-components/native';
import {colors} from '@/constants';


const SearchInstrumentTab = () => {
  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16 }}>
      <SectionTitle>인기 검색어</SectionTitle>
      <KeywordWrap>
        {Array.from({ length: 7 }).map((_, i) => (
          <Keyword key={i}>
            <Circle />
            <KeywordText>악기</KeywordText>
          </Keyword>
        ))}
      </KeywordWrap>
    </ScrollView>
  );
};

const SectionTitle = styled.Text`
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 28px;
  color: ${colors.GRAY_600};
`;

const KeywordWrap = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 16px;
`;

const Keyword = styled.View`
  padding: 8px 16px 8px 8px;
  background-color: ${colors.GRAY_100};
  border-radius: 60px;
  flex-direction: row;
  gap:10px;
  justify-content: center;
  align-items: center;
`;

const KeywordText = styled.Text`
  font-size: 15px;
  color: ${colors.GRAY_400};
`;

const Circle = styled.View`
  width: 32px;
  height: 32px;
  background-color: #cfcfcf;
  border-radius: 100px;
`;

export default SearchInstrumentTab;
