import React, {useState, useEffect} from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import styled from 'styled-components/native';
import {PostStackParamList} from '@/navigations/stack/PostStackNavigator';
import {colors, postNavigations} from '@/constants';
import IconButton from '@/components/common/IconButton';
import SearchAllTab from '@/components/search/SearchAllTab';
import SearchComposerTab from '@/components/search/SearchComposerTab';
import SearchPerformerTab from '@/components/search/SearchPerformerTab';
import SearchGenreTab from '@/components/search/SearchGenreTab';
import SearchPeriodTab from '@/components/search/SearchPeriodTab';
import SearchInstrumentTab from '@/components/search/SearchInstrumentTab';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  ScrollView,
  Text,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import SearchInputField from '@/components/search/SearchInputField';
import RecentSearchList from '@/components/search/RecentSearchList';
import AutoCompleteList from '@/components/search/AutoCompleteList';
import {useHideTabBarOnFocus} from '@/utils/roadBottomNavigationBar';

type IntroScreenProps = StackScreenProps<
  PostStackParamList,
  typeof postNavigations.POST_SEARCH
>;

function PostSearchScreen({navigation}: IntroScreenProps) {
  useHideTabBarOnFocus();
  const [selectedTab, setSelectedTab] = useState<
    'all' | 'composer' | 'performer' | 'genre' | 'period' | 'instrument'
  >('all');
  const [searchText, setSearchText] = useState('');
  const [showRecent, setShowRecent] = useState(false);

  const [recentKeywords, setRecentKeywords] = useState<string[]>([
    '카페에서 듣기 좋은 클래식',
    '바이올린 협주곡',
    '멘델스존',
    'Hilary Hahn',
  ]);

  const handleClearOne = (keyword: string) => {
    setRecentKeywords(prev => prev.filter(k => k !== keyword));
  };

  const handleClearAll = () => {
    setRecentKeywords([]);
  };

  useEffect(() => {
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      //          setShowRecent(false);
    });

    return () => {
      hideSub.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{flex: 1}}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <Header>
            <IconButton<PostStackParamList>
              imageSource={require('@/assets/icons/post/BackArrow.png')}
              target={[postNavigations.POST_HOME]}
              size={24}
            />
            <SearchInputField
              value={searchText}
              onChangeText={setSearchText}
              placeholder="작곡가, 연주가, 장르, 시대 등"
              onFocus={() => setShowRecent(true)}
              onSubmitEditing={() => {
                if (searchText.trim() !== '') {
                  navigation.navigate(postNavigations.POST_SEARCH_RESULT, {
                    searchKeyword: searchText,
                  });
                  setShowRecent(false);
                }
              }}
            />
          </Header>
          {showRecent ? (
            <FocusContent>
              {/* 입력 중일 때 보여줄 화면 */}
              {searchText.trim() === '' ? (
                <>
                  <RecentSearchList
                    keywords={recentKeywords}
                    onClearOne={handleClearOne}
                    onClearAll={handleClearAll}
                  />
                </>
              ) : (
                <>
                  <AutoCompleteList
                    suggestions={['Bach', 'Bach Classic', 'Beethoven']}
                    searchText={searchText}
                    onSelect={text => {
                      setSearchText(text);
                      Keyboard.dismiss();
                    }}
                  />
                </>
              )}
            </FocusContent>
          ) : (
            <>
              <TabRowScroll>
                <TabScrollContent>
                  <TabButton
                    isActive={selectedTab === 'all'}
                    onPress={() => setSelectedTab('all')}>
                    <TabText isActive={selectedTab === 'all'}>통합</TabText>
                  </TabButton>
                  <TabButton
                    isActive={selectedTab === 'composer'}
                    onPress={() => setSelectedTab('composer')}>
                    <TabText isActive={selectedTab === 'composer'}>
                      작곡가
                    </TabText>
                  </TabButton>
                  <TabButton
                    isActive={selectedTab === 'performer'}
                    onPress={() => setSelectedTab('performer')}>
                    <TabText isActive={selectedTab === 'performer'}>
                      연주가
                    </TabText>
                  </TabButton>
                  <TabButton
                    isActive={selectedTab === 'genre'}
                    onPress={() => setSelectedTab('genre')}>
                    <TabText isActive={selectedTab === 'genre'}>장르</TabText>
                  </TabButton>
                  <TabButton
                    isActive={selectedTab === 'period'}
                    onPress={() => setSelectedTab('period')}>
                    <TabText isActive={selectedTab === 'period'}>시대</TabText>
                  </TabButton>
                  <TabButton
                    isActive={selectedTab === 'instrument'}
                    onPress={() => setSelectedTab('instrument')}>
                    <TabText isActive={selectedTab === 'instrument'}>
                      악기
                    </TabText>
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
            </>
          )}
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
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
  background-color: ${colors.WHITE};
  position: relative;
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

const TabButton = styled.TouchableOpacity<{isActive: boolean}>`
  padding: 12px 18px;
  border-bottom-width: ${({isActive}) => (isActive ? 2 : 0)}px;
  border-bottom-color: ${({isActive}) =>
    isActive ? colors.LINE_BLUE : 'transparent'};
  align-items: center;
  height: 100%;
`;

const TabText = styled.Text<{isActive: boolean}>`
  font-size: 16px;
  color: ${({isActive}) => (isActive ? colors.LINE_BLUE : colors.GRAY_500)};
  font-weight: ${({isActive}) => (isActive ? 'bold' : 'normal')};
`;

const TabContent = styled.View`
    flex: 1;
    width: 100%;
`;

const FocusContent = styled.View`
  position: absolute;
  top: 84px; /* Header 높이 + margin 고려 */
  left: 0;
  right: 0;
  background-color: ${colors.WHITE};
  z-index: 999;
  padding: 16px 20px;
`;

const FocusTitle = styled.Text`
  font-size: 17px;
  font-weight: bold;
  margin-bottom: 12px;
  color: ${colors.GRAY_600};
`;

export default PostSearchScreen;
