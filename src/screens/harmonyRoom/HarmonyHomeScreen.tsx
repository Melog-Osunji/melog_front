import React from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Dimensions, FlatList, RefreshControl, ActivityIndicator} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {HarmonyStackParamList} from '@/navigations/stack/HarmonyStackNavigator';
import LinearGradient from 'react-native-linear-gradient';
import {colors, postNavigations, harmonyNavigations} from '@/constants';
import IconButton from '@/components/common/IconButton';
import {RecentHarmonyRoomData, RecommendRoomData} from '@/constants/dummyData';
import HarmonyRoomStrip from '@/components/harmonyRoom/HarmonyRoomStrip';
import RecommendCard from '@/components/harmonyRoom/RecommendCard';
import RecentMediaCard from '@/components/harmonyRoom/RecentMediaCard';
import {
  useMyHarmonyRoomAll,
  useHarmonyRecentMedia,
  useHarmonyRecommendRooms,
  type MyHarmonyRoomListDTO,
  type harmonyRecentMediaDTO,
  type harmonyRecommendDTO,
} from '@/hooks/queries/harmony/useHarmonyRoomGet';
import type { HarmonyStackParamList } from '@/navigations/stack/HarmonyStackNavigator';


const {width: SCREEN_W} = Dimensions.get('window');

type HarmonyPageScreenRouteProp = StackScreenProps<
  HarmonyStackParamList,
  'HARMONY_PAGE'
>['route'];

function HarmonyHomeScreen() {

  const navigation = useNavigation<StackNavigationProp<HarmonyStackParamList>>();

  const communities: Community[] = [
      { id: 'c1', name: '내 클래식 운영방', isOwner: true },
      { id: 'c2', name: '바흐 클럽', isFavorite: true },
      { id: 'c3', name: '가곡 연구회' },
      { id: 'c4', name: '첼로 애호가' },
      { id: 'c5', name: '피아노 살롱' },
    ];

  return (
    <LinearGradient
      colors={['#EFFAFF', colors.WHITE]} // 원하는 색 배열
      start={{x: 1, y: 0}}
      end={{x: 1, y: 0.3}}
      style={styles.container}
    >
        <SafeAreaView style={styles.content}>
            {/* 헤더 */}
            <View style={styles.header}>
                <View style={styles.headerTitle}>
                    <Image source={require('@/assets/icons/harmonyRoom/HarmonyRoomLogo.png')} style={styles.headerImg}/>
                    <Text style={styles.headerText}>하모니룸</Text>
                </View>
                <View style={styles.headerBtn}>
                <IconButton<MyPageStackParamList>
                    imageSource={require('@/assets/icons/harmonyRoom/HarmonyRoomCreate.png')}
                    target={[harmonyNavigations.HARMONY_CREATE]}
                />
                <IconButton<MyPageStackParamList>
                    imageSource={require('@/assets/icons/post/Search.png')}
                    target={[harmonyNavigations.HARMONY_CREATE]}
                />
                <IconButton<MyPageStackParamList>
                    imageSource={require('@/assets/icons/post/Notice.png')}
                    target={[harmonyNavigations.HARMONY_CREATE]}
                />
                </View>
            </View>
            <ScrollView style={styles.scroll}>
                {/* 나의 하모니룸 */}
                <View style={styles.section1}>
                    <Text style={styles.title}>나의 하모니룸</Text>
                    <HarmonyRoomStrip
                      communities={communities}
                      onChange={(id) => {
                        // TODO: id === 'all' 이면 전체 피드, 아니면 해당 커뮤니티 필터링 로직 호출
                      }}
                    />
                </View>
                {/* 최근 업로드된 미디어 */}
                <View style={styles.section2}>
                    <Text style={styles.title}>최근 업로드된 미디어</Text>
                    <FlatList
                        data={RecentHarmonyRoomData}
                        keyExtractor={(item, index) => `${item.roomID}_${index}`}
                        renderItem={({ item }) => <RecentMediaCard data={item} />}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.horizontalListContent}
                        ItemSeparatorComponent={() => <View style={{ width: 15 }} />}
                    />
                </View>
                <View style={styles.section3}>
                    <Text style={styles.title}>추천 하모니룸</Text>
                    {RecommendRoomData.map((item, idx) => (
                        <View key={`${item.roomID}_${idx}`} style={styles.horizontalListContent}>
                          <RecommendCard data={item} />
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: SCREEN_W,
  },
  content: {
    width: '100%',
    flex: 1, alignItems: 'center'
  },
  header: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 9,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.LINE_GREY,
  },
  headerTitle: {
    flexDirection: 'row',
    gap: 6,
  },
  headerText: {
    fontFamily: 'Noto Sans KR',
    fontSize: 17,
    fontWeight: '500',
    letterSpacing: 0.1,
    lineHeight: 24,
    color: colors.GRAY_600,
  },
  headerBtn: {
    flexDirection: 'row',
    gap: 9,
  },
  scroll: {
    marginBottom: 60,
  },
  section1: {
    paddingVertical: 16,
    flexDirection: 'column',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.LINE_GREY,
  },
  title: {
    fontFamily: 'Noto Sans KR',
    fontSize: 17,
    fontWeight: '500',
    letterSpacing: 0.1,
    lineHeight: 24,
    color: colors.GRAY_600,
    paddingHorizontal: 20,
  },
  section2: {
    paddingVertical: 16,
    flexDirection: 'column',
    gap: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.LINE_GREY,
  },

  horizontalListContent: {
    paddingHorizontal: 20,
  },
  section3: {
    paddingVertical: 16,
    flexDirection: 'column',
    gap: 16,
  }
});

export default HarmonyHomeScreen;
