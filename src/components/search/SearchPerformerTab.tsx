import React from 'react';
import { ScrollView, Dimensions } from 'react-native';
import styled from 'styled-components/native';
import {colors} from '@/constants';

const DEVICE_WIDTH = Dimensions.get('window').width;


const performers = Array.from({ length: 6 }).map((_, i) => `이름 ${i}`);

const SearchPerformerTab = () => {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16}}>
      <SectionTitle>인기 검색어</SectionTitle>
        <Container>
          {performers.map((name, i) => (
            <PerformerItem key={i}>
              <Name>{name}</Name>
              <KeywordRow>
                <Keyword>#관련 키워드</Keyword>
                <Keyword>#관련 키워드</Keyword>
              </KeywordRow>
            </PerformerItem>
          ))}
        </Container>
    </ScrollView>
  );
};



const SectionTitle = styled.Text`
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 28px;
  color: ${colors.GRAY_600};
`;

const Container = styled.View`
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  width: ${DEVICE_WIDTH}px;
`;


const PerformerItem = styled.View`
  padding-vertical:12px;
  width:100%;
  flex-direction:column;
  gap:12px;
`;

const Name = styled.Text`
  font-size: 15px;
  font-weight: 700;
  line-height:22px;
  color: ${colors.GRAY_600};
`;

const KeywordRow = styled.View`
  flex-direction: row;
  gap: 8px;
`;

const Keyword = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color:${colors.BLUE_500};
`;

export default SearchPerformerTab;
