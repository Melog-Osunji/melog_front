import React, {useState, useEffect} from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {
  ScrollView,
  Text,
  Dimensions,
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {HarmonyStackParamList} from '@/navigations/stack/HarmonyStackNavigator';
import {colors, harmonyNavigations} from '@/constants';
import IconButton from '@/components/common/IconButton';
import {useHideTabBarOnFocus} from '@/hooks/common/roadBottomNavigationBar';
import { useHarmonySearch } from '@/hooks/queries/harmonyRoom/useHarmonyRoomGet';
import RecommendCard from '@/components/harmonyRoom/RecommendCard';
import SearchInputField from '@/components/search/SearchInputField';


type IntroScreenProps = StackScreenProps<
  HarmonyStackParamList,
  typeof harmonyNavigations.HARMONY_SEARCH_RESULT
>;

const DEVICE_WIDTH = Dimensions.get('window').width;
const TAB_WIDTH = DEVICE_WIDTH / 4;

function HarmonySearchResultScreen({navigation, route}: IntroScreenProps) {
  useHideTabBarOnFocus();

  const initial = route.params?.searchKeyword ?? '';
  const [text, setText] = useState(initial);
  const [keyword, setKeyword] = useState(initial);

  const { data, isLoading, isError } = useHarmonySearch(keyword);

  console.log(data);

  // 다른 화면에서 새 키워드로 다시 진입했을 때 반영
  useEffect(() => {
    if (route.params?.searchKeyword && route.params.searchKeyword !== keyword) {
      setText(route.params.searchKeyword);
      setKeyword(route.params.searchKeyword);
    }
  }, [route.params?.searchKeyword]);

  const handleSearchSubmit = () => {
    const q = text.trim();
    if (!q) return;
    setKeyword(q);
    Keyboard.dismiss();
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
          placeholder="하모니룸 이름 검색"
          onSubmitEditing={handleSearchSubmit}
        />
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.navigate(harmonyNavigations.HARMONY_SEARCH)}>
          <Text style={styles.cancelText}>취소</Text>
        </TouchableOpacity>
      </View>

      {/* Result Content */}
      <ScrollView
        style={styles.tabContent}
        contentContainerStyle={{paddingVertical: 16, paddingHorizontal: 20}}>
        {isLoading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.BLUE_400} />
          <Text style={styles.loadingText}>검색 중...</Text>
        </View>
        )}

        {isError && (
        <View style={styles.center}>
          <Text style={{color: colors.RED_500}}>검색 실패. 다시 시도해주세요.</Text>
        </View>
        )}

        {!isLoading && !isError && data?.length === 0 && (
        <View style={styles.center}>
          <Text style={{color: colors.GRAY_500}}>검색 결과가 없습니다.</Text>
        </View>
        )}

        {!isLoading &&
        !isError &&
        data?.map(item => (
          <View key={item.id} style={{marginBottom: 12}}>
            <RecommendCard data={item} />
          </View>
        ))}
      </ScrollView>
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
  tabContent: {
    flex: 1,
    width: '100%',
  },
  cancelButton: {
    marginLeft: 8,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  cancelText: {
    fontSize: 12,
    color: colors.GRAY_600,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.GRAY_600,
  },
});

export default HarmonySearchResultScreen;
