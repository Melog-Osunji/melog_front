import React from 'react';
import { ScrollView, Text } from 'react-native';
import styled from 'styled-components/native';

const SearchGenreTab = () => {
  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16 }}>
      {Array.from({ length: 3 }).map((_, sectionIdx) => (
        <GenreSection key={sectionIdx}>
          <SectionTitle>장르</SectionTitle>
          <KeywordWrap>
            {Array.from({ length: 4 }).map((_, i) => (
              <Keyword key={i}>해당 장르 키워드</Keyword>
            ))}
          </KeywordWrap>
        </GenreSection>
      ))}
    </ScrollView>
  );
};

const GenreSection = styled.View`
  margin-bottom: 20px;
`;

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

export default SearchGenreTab;
