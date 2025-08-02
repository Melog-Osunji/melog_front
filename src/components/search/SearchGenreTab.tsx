import React from 'react';
import { ScrollView, Text } from 'react-native';
import styled from 'styled-components/native';
import {colors} from '@/constants';


const SearchGenreTab = () => {
  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 20}}>
      {Array.from({ length: 3 }).map((_, sectionIdx) => (
        <GenreSection key={sectionIdx}>
          <SectionTitle>장르</SectionTitle>
          <KeywordWrap>
            {Array.from({ length: 4 }).map((_, i) => (
              <Keyword key={i}><KeywordText>해당 장르 키워드</KeywordText></Keyword>
            ))}
          </KeywordWrap>
        </GenreSection>
      ))}
    </ScrollView>
  );
};


const SectionTitle = styled.Text`
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 28px;
  color: ${colors.GRAY_600};
`;


const GenreSection = styled.View`
  margin-vertical: 16px;
`;

const KeywordWrap = styled.View`
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
  font-size: 14px;
  color: ${colors.GRAY_400};
`;

export default SearchGenreTab;
