import React, {useState} from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {
  ScrollView,
  Text,
  Dimensions,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {PostStackParamList} from '@/navigations/stack/PostStackNavigator';
import {colors, postNavigations} from '@/constants';
import IconButton from '@/components/common/IconButton';
import SearchResultAllTab from '@/components/search/SearchResultAllTab';
import SearchResultProfileTab from '@/components/search/SearchResultProfileTab';
import SearchResultFeedTab from '@/components/search/SearchResultFeedTab';
import SearchResultHarmonyTab from '@/components/search/SearchResultHarmonyTab';
import SearchInputField from '@/components/search/SearchInputField';
import {useHideTabBarOnFocus} from '@/utils/roadBottomNavigationBar';

type IntroScreenProps = StackScreenProps<
  PostStackParamList,
  typeof postNavigations.POST_SEARCH_RESULT
>;

const DEVICE_WIDTH = Dimensions.get('window').width;
const TAB_WIDTH = DEVICE_WIDTH / 4;

function PostSearchResultScreen({navigation}: IntroScreenProps) {
  useHideTabBarOnFocus();

  const [selectedTab, setSelectedTab] = useState<
    'all' | 'profile' | 'feed' | 'harmony'
  >('all');
  const [keyword, setKeyword] = useState('Bach');

  const handleSearchSubmit = () => {
    console.log('검색어:', keyword);
    // TODO: 필터링 또는 API 호출 로직
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton<PostStackParamList>
          imageSource={require('@/assets/icons/post/BackArrow.png')}
          target={'goBack'}
          size={24}
        />
        <SearchInputField
          value={keyword}
          onChangeText={setKeyword}
          placeholder="작곡가, 연주가, 장르, 시대 등"
          onSubmitEditing={handleSearchSubmit}
        />
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.navigate(postNavigations.POST_SEARCH)}>
          <Text style={styles.cancelText}>취소</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
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
              style={[styles.tabText, selectedTab === 'all' && styles.tabTextActive]}>
              전체
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              selectedTab === 'profile' && styles.tabButtonActive,
            ]}
            onPress={() => setSelectedTab('profile')}>
            <Text
              style={[
                styles.tabText,
                selectedTab === 'profile' && styles.tabTextActive,
              ]}>
              프로필
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              selectedTab === 'feed' && styles.tabButtonActive,
            ]}
            onPress={() => setSelectedTab('feed')}>
            <Text
              style={[
                styles.tabText,
                selectedTab === 'feed' && styles.tabTextActive,
              ]}>
              피드
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              selectedTab === 'harmony' && styles.tabButtonActive,
            ]}
            onPress={() => setSelectedTab('harmony')}>
            <Text
              style={[
                styles.tabText,
                selectedTab === 'harmony' && styles.tabTextActive,
              ]}>
              하모니룸
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Tab Content */}
      <View style={styles.tabContent}>
        {selectedTab === 'all' && <SearchResultAllTab />}
        {selectedTab === 'profile' && <SearchResultProfileTab />}
        {selectedTab === 'feed' && <SearchResultFeedTab />}
        {selectedTab === 'harmony' && <SearchResultHarmonyTab />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center', // 기존 styled(Container)와 동일
    backgroundColor: colors.WHITE,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
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
    width: TAB_WIDTH,
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
  cancelButton: {
    marginLeft: 8,
  },
  cancelText: {
    fontSize: 12,
    color: colors.GRAY_600,
  },
});

export default PostSearchResultScreen;
