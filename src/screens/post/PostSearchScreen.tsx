import React, { useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import styled from 'styled-components/native';
import { PostStackParamList } from '@/navigations/stack/PostStackNavigator';
import { colors, postNavigations } from '@/constants';
import IconButton from '@/components/IconButton';
import InputField from '@/components/InputField';
import SearchAllTab from '@/components/search/SearchAllTab';
import SearchComposerTab from '@/components/search/SearchComposerTab';
import SearchPerformerTab from '@/components/search/SearchPerformerTab';
import SearchGenreTab from '@/components/search/SearchGenreTab';
import SearchPeriodTab from '@/components/search/SearchPeriodTab';
import SearchInstrumentTab from '@/components/search/SearchInstrumentTab';
import {SafeAreaView} from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';

type IntroScreenProps = StackScreenProps<
  PostStackParamList,
  typeof postNavigations.POST_SEARCH
>;

function PostSearchScreen({navigation}: IntroScreenProps) {
   const [selectedTab, setSelectedTab] = useState<'all' | 'composer' | 'performer' | 'genre' | 'period' | 'instrument'>('all');

      return (
        <Container>
            <Header>
                <IconButton<PostStackParamList>
                    imageSource={require('@/assets/icons/post/BackArrow.png')}
                    target={[postNavigations.POST_HOME]}
                  />
            </Header>
        <TabRowScroll>
            <TabScrollContent>
                <TabButton isActive={selectedTab === 'all'} onPress={() => setSelectedTab('all')}>
                  <TabText isActive={selectedTab === 'all'}>통합</TabText>
                </TabButton>
                <TabButton isActive={selectedTab === 'composer'} onPress={() => setSelectedTab('composer')}>
                  <TabText isActive={selectedTab === 'composer'}>작곡가</TabText>
                </TabButton>
                <TabButton isActive={selectedTab === 'performer'} onPress={() => setSelectedTab('performer')}>
                  <TabText isActive={selectedTab === 'performer'}>연주가</TabText>
                </TabButton>
                <TabButton isActive={selectedTab === 'genre'} onPress={() => setSelectedTab('genre')}>
                  <TabText isActive={selectedTab === 'genre'}>장르</TabText>
                </TabButton>
                <TabButton isActive={selectedTab === 'period'} onPress={() => setSelectedTab('period')}>
                  <TabText isActive={selectedTab === 'period'}>시대</TabText>
                </TabButton>
                <TabButton isActive={selectedTab === 'instrument'} onPress={() => setSelectedTab('instrument')}>
                  <TabText isActive={selectedTab === 'instrument'}>악기</TabText>
                </TabButton>
            </TabScrollContent>
        </TabRowScroll>

      <TabContent>
            {selectedTab === 'all' && <SearchAllTab />}
            {selectedTab === 'composer' && <SearchComposerTab />}
            {selectedTab === 'performer' && <SearchPerformerTab />}
            {selectedTab === 'genre' && <SearchGenreTab />}
            {selectedTab === 'period' && <SearchPeriodTab />}
            {selectedTab === 'instrument' && <SearchInstrumentTab />}
      </TabContent>
        </Container>
      );
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

export default PostSearchScreen;
