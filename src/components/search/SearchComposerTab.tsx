import React from 'react';
import { FlatList, Text, ScrollView, Dimensions } from 'react-native';
import styled from 'styled-components/native';
import {colors} from '@/constants';

const SCREEN_WIDTH = Dimensions.get('window').width;
const PADDING_HORIZONTAL = 20;
const ITEM_WIDTH = (SCREEN_WIDTH - PADDING_HORIZONTAL * 2) / 3;

const composers = Array.from({ length: 12 }).map((_, i) => `이름 ${i}`);

const SearchComposerTab = () => {
  return (
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16, }}>
          <SectionTitle>인기 검색어</SectionTitle>
          <GridWrap>
            {composers.map((name, idx) => (
              <GridItem key={idx}>
                <Circle />
                <Name>{name}</Name>
              </GridItem>
            ))}
          </GridWrap>
      </ScrollView>
  );
};


const SectionTitle = styled.Text`
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 28px;
  color: ${colors.GRAY_600};
`;


const GridWrap = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
`;

const GridItem = styled.View`
  align-items: center;
  margin-bottom: 24px;
`;

const Circle = styled.View`
  width: 96px;
  height: 96px;
  border-radius: 100px;
  background-color: lightgray;
  margin-bottom: 12px;
`;

const Name = styled.Text``;

export default SearchComposerTab;
