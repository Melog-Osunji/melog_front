import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import axiosInstance from '@/api/axiosInstance';
import {Post} from '@/constants/types';
import {StackScreenProps} from '@react-navigation/stack';
import {PostStackParamList} from '@/navigations/stack/PostStackNavigator';
import IconButton from '@/components/IconButton';
import {DropdownMenu} from '@/components/DropdownMenu';
import PostList from '@/components/post/PostList';
import styled from 'styled-components/native';
import {mockPosts} from '@/constants/types'; // 더미 데이터
import {colors, postNavigations} from '@/constants';

type IntroScreenProps = StackScreenProps<
  PostStackParamList,
  typeof postNavigations.POST_HOME
>;

function PostHomeScreen({navigation}: IntroScreenProps) {
  return (
    <Container>
      <Header>
        <DropdownMenu
          trigger={(open: () => void) => (
            <HeaderTitleTouchable onPress={open}>
              <HeaderTitleText>추천 피드</HeaderTitleText>
            </HeaderTitleTouchable>
          )}
          items={[
            {
              label: '추천 피드',
              onPress: function (): void {
                throw new Error('Function not implemented.');
              },
            },
            {
              label: '인기 피드',
              onPress: function (): void {
                throw new Error('Function not implemented.');
              },
            },
          ]}
        />
        <HeaderIconRow>
          <IconButton<PostStackParamList>
            imageSource={require('@/assets/icons/post/Search.png')}
            target={[postNavigations.POST_SEARCH]}
          />
          <IconButton<PostStackParamList>
            imageSource={require('@/assets/icons/post/Notice.png')}
            target={[postNavigations.POST_SEARCH]}
          />
        </HeaderIconRow>
      </Header>

      <PostList data={mockPosts} />
    </Container>
  );
}

// Styled Components
const Header = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: 20px;
  padding-vertical: 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${colors.GRAY_100};
`;

const HeaderTitleTouchable = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

const HeaderTitleText = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${colors.BLACK};
`;

const HeaderIconRow = styled.View`
  flex-direction: row;
  gap: 8px;
`;

const Container = styled(SafeAreaView)`
  flex: 1;
  align-items: center;
  background-color: ${colors.WHITE};
`;

export default PostHomeScreen;
