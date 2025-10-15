import React, {useState, useEffect} from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {
  ScrollView,
  Text,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {PostStackParamList} from '@/navigations/stack/PostStackNavigator';
import {colors, postNavigations} from '@/constants';
import IconButton from '@/components/common/IconButton';
import SearchAllTab from '@/components/search/SearchAllTab';
import SearchComposerTab from '@/components/search/SearchComposerTab';
import SearchPerformerTab from '@/components/search/SearchPerformerTab';
import SearchGenreTab from '@/components/search/SearchGenreTab';
import SearchPeriodTab from '@/components/search/SearchPeriodTab';
import SearchInstrumentTab from '@/components/search/SearchInstrumentTab';
import SearchInputField from '@/components/search/SearchInputField';
import RecentSearchList from '@/components/search/RecentSearchList';
import AutoCompleteList from '@/components/search/AutoCompleteList';
import {useHideTabBarOnFocus} from '@/hooks/common/roadBottomNavigationBar';
import {useDebounce} from '@/hooks/useDebounce';
import {useSearching} from '@/hooks/queries/search/useSearching';

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
  const debounced = useDebounce(searchText, 200);
  const [showOverlay, setShowOverlay] = useState(false);

  const [recentKeywords, setRecentKeywords] = useState<string[]>([
    '카페에서 듣기 좋은 클래식',
    '바이올린 협주곡',
    '멘델스존',
    'Hilary Hahn',
  ]);

  // 자동완성 데이터
  const {data, isFetching, isError} = useSearching(debounced);
  const suggestions = data?.suggestions ?? [];

  console.log(data);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () =>
      setShowOverlay(true),
    );
    const hideSub = Keyboard.addListener('keyboardDidHide', () =>
      setShowOverlay(false),
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleSubmit = (keyword: string) => {
    const q = keyword.trim();
    if (!q) return;
    // 최근검색 갱신 (중복 제거 + 앞쪽 삽입)
    setRecentKeywords(prev => [q, ...prev.filter(k => k !== q)].slice(0, 10));
    navigation.navigate(postNavigations.POST_SEARCH_RESULT, {searchKeyword: q});
  };

  const handleClearOne = (keyword: string) => {
    setRecentKeywords(prev => prev.filter(k => k !== keyword));
  };

  const handleClearAll = () => {
    setRecentKeywords([]);
  };

  useEffect(() => {
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      // setShowRecent(false);
    });
    return () => hideSub.remove();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{flex: 1}}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.header}>
            <IconButton<PostStackParamList>
              imageSource={require('@/assets/icons/post/BackArrow.png')}
              target={[postNavigations.POST_HOME]}
              size={24}
            />
            <SearchInputField
              value={searchText}
              onChangeText={setSearchText}
              placeholder="작곡가, 연주가, 장르, 시대 등"
              onFocus={() => setShowOverlay(true)}
              onSubmitEditing={() => handleSubmit(searchText)}
            />
          </View>
        </TouchableWithoutFeedback>

        {/* 최근검색/자동완성 (포커스 상태) */}
        {showOverlay ? (
          <View style={styles.focusContent}>
            {searchText.trim() === '' ? (
              <RecentSearchList
                keywords={recentKeywords}
                onClearOne={handleClearOne}
                onClearAll={handleClearAll}
              />
            ) : (
              <AutoCompleteList
                suggestions={isError ? [] : suggestions}
                searchText={searchText}
                onSelect={text => {
                  setSearchText(text);
                  Keyboard.dismiss();
                  handleSubmit(text);
                }}
              />
            )}
            {/* 로딩/에러 뱃지 정도만 보조적으로 */}
            {isFetching && (
              <Text style={{marginTop: 8, color: colors.GRAY_400}}>
                불러오는 중…
              </Text>
            )}
            {isError && (
              <Text style={{marginTop: 8, color: colors.RED_500}}>
                자동완성 로딩 실패
              </Text>
            )}
          </View>
        ) : (
          <>
            {/* 탭 스크롤 바 */}
            <View style={styles.tabRowScroll}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tabScrollContent}>
                <TouchableOpacity
                  style={[
                    styles.tabButton,
                    selectedTab === 'all' && styles.tabButtonActive,
                  ]}
                  onPress={() => setSelectedTab('all')}>
                  <Text
                    style={[
                      styles.tabText,
                      selectedTab === 'all' && styles.tabTextActive,
                    ]}>
                    통합
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.tabButton,
                    selectedTab === 'composer' && styles.tabButtonActive,
                  ]}
                  onPress={() => setSelectedTab('composer')}>
                  <Text
                    style={[
                      styles.tabText,
                      selectedTab === 'composer' && styles.tabTextActive,
                    ]}>
                    작곡가
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.tabButton,
                    selectedTab === 'performer' && styles.tabButtonActive,
                  ]}
                  onPress={() => setSelectedTab('performer')}>
                  <Text
                    style={[
                      styles.tabText,
                      selectedTab === 'performer' && styles.tabTextActive,
                    ]}>
                    연주가
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.tabButton,
                    selectedTab === 'genre' && styles.tabButtonActive,
                  ]}
                  onPress={() => setSelectedTab('genre')}>
                  <Text
                    style={[
                      styles.tabText,
                      selectedTab === 'genre' && styles.tabTextActive,
                    ]}>
                    장르
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.tabButton,
                    selectedTab === 'period' && styles.tabButtonActive,
                  ]}
                  onPress={() => setSelectedTab('period')}>
                  <Text
                    style={[
                      styles.tabText,
                      selectedTab === 'period' && styles.tabTextActive,
                    ]}>
                    시대
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.tabButton,
                    selectedTab === 'instrument' && styles.tabButtonActive,
                  ]}
                  onPress={() => setSelectedTab('instrument')}>
                  <Text
                    style={[
                      styles.tabText,
                      selectedTab === 'instrument' && styles.tabTextActive,
                    ]}>
                    악기
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>

            {/* 탭 콘텐츠 */}
            <View style={styles.tabContent}>
              {selectedTab === 'all' && (
                <SearchAllTab
                  onSelect={text => {
                    setSearchText(text);
                    Keyboard.dismiss();
                    handleSubmit(text);
                  }}
                />
              )}
              {selectedTab === 'composer' && (
                <SearchComposerTab
                  onSelect={text => {
                    setSearchText(text);
                    Keyboard.dismiss();
                    handleSubmit(text);
                  }}
                />
              )}
              {selectedTab === 'performer' && (
                <SearchPerformerTab
                  onSelect={text => {
                    setSearchText(text);
                    Keyboard.dismiss();
                    handleSubmit(text);
                  }}
                />
              )}
              {selectedTab === 'genre' && (
                <SearchGenreTab
                  onSelect={text => {
                    setSearchText(text);
                    Keyboard.dismiss();
                    handleSubmit(text);
                  }}
                />
              )}
              {selectedTab === 'period' && (
                <SearchPeriodTab
                  onSelect={text => {
                    setSearchText(text);
                    Keyboard.dismiss();
                    handleSubmit(text);
                  }}
                />
              )}
              {selectedTab === 'instrument' && (
                <SearchInstrumentTab
                  onSelect={text => {
                    setSearchText(text);
                    Keyboard.dismiss();
                    handleSubmit(text);
                  }}
                />
              )}
            </View>
          </>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
    position: 'relative',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY_100,
  },
  tabRowScroll: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  tabScrollContent: {
    alignItems: 'center',
    paddingHorizontal: 0,
  },
  tabButton: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: 'center',
    height: '100%',
    borderBottomWidth: 0,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.LINE_BLUE,
  },
  tabText: {
    fontSize: 16,
    color: colors.GRAY_500,
    fontWeight: 'normal',
  },
  tabTextActive: {
    color: colors.LINE_BLUE,
    fontWeight: 'bold',
  },
  tabContent: {
    flex: 1,
    width: '100%',
  },
  focusContent: {
    position: 'absolute',
    top: 84, // 헤더 높이 고려
    left: 0,
    right: 0,
    backgroundColor: colors.WHITE,
    zIndex: 999,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
});

export default PostSearchScreen;
