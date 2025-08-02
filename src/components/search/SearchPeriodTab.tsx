import React from 'react';
import { ScrollView, Dimensions } from 'react-native';
import styled from 'styled-components/native';
import {colors} from '@/constants';

const DEVICE_WIDTH = Dimensions.get('window').width;


const SearchPeriodTab = () => {
  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16 }}>
    <Container>
      <SectionTitle>인기 검색어</SectionTitle>
      <KeywordWrap>
        {Array.from({ length: 6 }).map((_, i) => (
          <Keyword key={i}><KeywordText>키워드</KeywordText></Keyword>
        ))}
      </KeywordWrap>
    </Container>
    </ScrollView>
  );
};

const Container = styled.View`
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  width: ${DEVICE_WIDTH}px;
`;

const SectionTitle = styled.Text`
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 28px;
  color: ${colors.GRAY_600};
`;

const KeywordWrap = styled.View`
  width:294px;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 18px;
`;

const Keyword = styled.View`
  height: 48px;
  padding-horizontal: 16px;
  padding-vertical: 8px;
  background-color: ${colors.GRAY_100};
  border-radius: 60px;
  justify-content: center;
  align-items: center;
`;

const KeywordText = styled.Text`
  font-size: 15px;
  color: ${colors.GRAY_400};
`;

export default SearchPeriodTab;
