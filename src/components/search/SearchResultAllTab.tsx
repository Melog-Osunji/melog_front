import React from 'react';
import { ScrollView, Text } from 'react-native';
import styled from 'styled-components/native';
import {colors} from '@/constants';
import {mockPosts} from '@/constants/types'; // 더미 데이터
import PostList from '@/components/post/PostList';



const SearchResultAllTab = () => {
  return (
    <ScrollView contentContainerStyle={{paddingVertical: 24, }}>
      <FirstView>
          <SectionTitle>인기 미디어</SectionTitle>
      </FirstView>
      <SecondView>
          <SectionTitle>실시간 인기 피드</SectionTitle>
          <PostList data={mockPosts} />
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
  margin-left: 20px;
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

export default SearchResultAllTab;
