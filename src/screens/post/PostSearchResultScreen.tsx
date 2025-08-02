import React, { useState, useEffect } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import styled from 'styled-components/native';
import { PostStackParamList } from '@/navigations/stack/PostStackNavigator';
import { colors, postNavigations } from '@/constants';
import IconButton from '@/components/IconButton';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
    ScrollView,
    Text,
    Dimensions
    } from 'react-native';
import SearchResultAllTab from '@/components/search/SearchResultAllTab.tsx';
import SearchResultProfileTab from '@/components/search/SearchResultProfileTab.tsx';
import SearchResultFeedTab from '@/components/search/SearchResultFeedTab.tsx';
import SearchResultHarmonyTab from '@/components/search/SearchResultHarmonyTab.tsx';


type IntroScreenProps = StackScreenProps<
  PostStackParamList,
  typeof postNavigations.POST_SEARCH_RESULT
>;

const DEVICE_WIDTH = Dimensions.get('window').width;
const TAB_WIDTH = DEVICE_WIDTH / 4;

function PostSearchResultScreen ({navigation}: IntroScreenProps) {
   const [selectedTab, setSelectedTab] = useState<'all' | 'profile' | 'feed' | 'harmony'>('all');


    return(
        <Container>
            <Header>
                <IconButton<PostStackParamList>
                    imageSource={require('@/assets/icons/post/BackArrow.png')}
                    target={[postNavigations.POST_HOME]}
                    size={24}
                  />
            </Header>
            <TabRowScroll>
                <TabScrollContent>
                    <TabButton isActive={selectedTab === 'all'} onPress={() => setSelectedTab('all')}>
                      <TabText isActive={selectedTab === 'all'}>전체</TabText>
                    </TabButton>
                    <TabButton isActive={selectedTab === 'profile'} onPress={() => setSelectedTab('profile')}>
                      <TabText isActive={selectedTab === 'profile'}>프로필</TabText>
                    </TabButton>
                    <TabButton isActive={selectedTab === 'feed'} onPress={() => setSelectedTab('feed')}>
                      <TabText isActive={selectedTab === 'feed'}>피드</TabText>
                    </TabButton>
                    <TabButton isActive={selectedTab === 'harmony'} onPress={() => setSelectedTab('harmony')}>
                      <TabText isActive={selectedTab === 'harmony'}>하모니룸</TabText>
                    </TabButton>
                </TabScrollContent>
            </TabRowScroll>

            <TabContent>
                {selectedTab === 'all' && <SearchResultAllTab />}
                {selectedTab === 'profile' && <SearchResultProfileTab />}
                {selectedTab === 'feed' && <SearchResultFeedTab />}
                {selectedTab === 'harmony' && <SearchResultHarmonyTab />}
          </TabContent>
        </Container>
    )
}

// styledComponent
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

const Container = styled(SafeAreaView)`
  flex: 1;
  align-items: center;
  background-color: ${colors.WHITE};
`;
const TabRowScroll = styled.View`
  width: 100%;
  border-bottom-width: 1px;
  border-bottom-color: transparent;
`;
const TabScrollContent = styled(ScrollView).attrs({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
  contentContainerStyle: {
    alignItems: 'center',
    paddingHorizontal: 0,
  },
})``;
const TabButton = styled.TouchableOpacity<{ isActive: boolean }>`
  padding: 12px 18px;
  width:${TAB_WIDTH}px;
  border-bottom-width: ${({ isActive }) => (isActive ? 2 : 0)}px;
  border-bottom-color: ${({ isActive }) => (isActive ? colors.LINE_BLUE : 'transparent')};
  align-items: center;
  height: 100%;
`;
const TabText = styled.Text<{ isActive: boolean }>`
  font-size: 16px;
  color: ${({ isActive }) => (isActive ? colors.LINE_BLUE : colors.GRAY_500)};
  font-weight: ${({ isActive }) => (isActive ? 'bold' : 'normal')};
`;

const TabContent = styled.View`
  flex: 1;
`;

const FocusContent = styled.ScrollView`
  width: 100%;
  padding: 16px 20px;
`;

const FocusTitle = styled.Text`
  font-size: 17px;
  font-weight: bold;
  margin-bottom: 12px;
  color: ${colors.GRAY_600};
`;

export default PostSearchResultScreen;