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
  ActivityIndicator
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {HarmonyStackParamList} from '@/navigations/stack/HarmonyStackNavigator';
import {colors, harmonyNavigations} from '@/constants';
import IconButton from '@/components/common/IconButton';
import SearchInputField from '@/components/search/SearchInputField';
import RecentSearchList from '@/components/search/RecentSearchList';
import AutoCompleteList from '@/components/search/AutoCompleteList';
import {useHideTabBarOnFocus} from '@/hooks/common/roadBottomNavigationBar';
import {useDebounce} from '@/hooks/useDebounce';
import {useSearching} from '@/hooks/queries/search/useSearching';

type IntroScreenProps = StackScreenProps<
  HarmonyStackParamList,
  typeof harmonyNavigations.HARMONY_SEARCH
>;

function HarmonySearchScreen({navigation}: IntroScreenProps) {
  useHideTabBarOnFocus();

  const [searchText, setSearchText] = useState('');
  const debounced = useDebounce(searchText, 200);
  const [showOverlay, setShowOverlay] = useState(true);

  const [recentKeywords, setRecentKeywords] = useState<string[]>([
    '카페에서 듣기 좋은 클래식',
    '바이올린 협주곡',
    '멘델스존',
    'Hilary Hahn',
  ]);

  // 자동완성 데이터
  const {data, isFetching, isError} = useSearching(debounced);
  const suggestions = data?.suggestions ?? [];

  const handleSubmit = (keyword: string) => {
    const q = keyword.trim();
    if (!q) return;
    // 최근검색 갱신 (중복 제거 + 앞쪽 삽입)
    setRecentKeywords(prev => [q, ...prev.filter(k => k !== q)].slice(0, 10));
    navigation.navigate(harmonyNavigations.HARMONY_SEARCH_RESULT, {searchKeyword: q});
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
            <IconButton<HarmonyStackParamList>
              imageSource={require('@/assets/icons/post/BackArrow.png')}
              target={[harmonyNavigations.HARMONY_HOME]}
              size={24}
            />
            <SearchInputField
              value={searchText}
              onChangeText={setSearchText}
              placeholder="하모니룸 이름 검색"
              onFocus={() => setShowOverlay(true)}
              onSubmitEditing={() => handleSubmit(searchText)}
            />
          </View>
        </TouchableWithoutFeedback>

        {/* 최근검색/자동완성 (포커스 상태) */}
        {showOverlay && (
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
            {isFetching && (
                <View style={styles.loaderWrap}>
                    <ActivityIndicator size="large" color={colors.BLUE_400} />
                    <Text style={styles.loadingText}>불러오는 중..</Text>
                </View>
            )}
            {isError && (
              <Text style={{marginTop: 8, color: colors.RED_500}}>
                자동완성 로딩 실패
              </Text>
            )}
          </View>
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
  loadingText: {
    fontSize: 16,
    color: colors.GRAY_500,
  },
  loaderWrap: {
    alignItems:'center',
    justifyContent:'center'
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

export default HarmonySearchScreen;
