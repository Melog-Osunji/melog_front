import React from 'react';
import { ScrollView, Text } from 'react-native';
import styled from 'styled-components/native';
import {colors} from '@/constants';

const SearchResultHarmonyTab = () => {
  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16, }}>
      <FirstView>
          <SectionTitle>인기 미디어</SectionTitle>
      </FirstView>

      <SecondView>
          <SectionTitle>실시간 인기 피드</SectionTitle>
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

export default SearchResultHarmonyTab;
