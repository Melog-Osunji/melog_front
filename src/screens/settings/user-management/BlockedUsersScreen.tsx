import React, {useMemo, useRef, useState, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Platform,
  FlatList,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import IconButton from '@/components/common/IconButton';
import {useNavigation, useFocusEffect, useRoute} from '@react-navigation/native';
import {useQueryClient} from '@tanstack/react-query';
import {useHideTabBarOnFocus} from '@/hooks/common/roadBottomNavigationBar';
import {colors} from '@/constants';
import {useBlockList} from '@/hooks/queries/settings/useSettingsQueries';
import RoomApplyCard, {ApplyUser} from '@/components/harmonyRoom/RoomApplyCard';
import SettingStackParamList from '@/navigations';
import {SafeAreaView} from 'react-native-safe-area-context';
import HelpIcon from '@/assets/icons/Help.svg';

const DEVICE_WIDTH = Dimensions.get('window').width;


type NavigationProp = StackNavigationProp<SettingStackParamList>;

type SettingsSettingRouteProp = StackScreenProps<
  SettingStackParamList,
  'BLOCKED_USERS'
>['route'];


export default function BlockedUsersScreen() {
  useHideTabBarOnFocus()
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<SettingsSettingRouteProp>();
  const qc = useQueryClient();

  // 1) 대기자 목록 조회
  const {
    data: blockListData,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useBlockList();

  // 2) 차단해제
//   const {mutateAsync: updateMembership, isPending} =
//     useUpdateHarmonyMembership(roomID);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const users: ApplyUser[] = useMemo(() => {
    const src = blockListData ?? [];
    return src.map(u => ({
      id: String(u.userId),
      name: u.nickname ?? '익명',
      intro: u.description ?? '',
      avatarUri: u.profileImg, // RoomApplyCard가 받는다면 그대로 전달
    }));
  }, [blockListData]);

  console.log(users);

  const handleApprove = async (userId: string) => {

  };

  const handleReject = async (userId: string) => {
  };

  if (isLoading && !blockListData) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton<PostStackParamList>
          imageSource={require('@/assets/icons/post/BackArrow.png')}
          target={'goBack'}
          size={24}
        />
        <Text style={styles.sectionTitle}>차단한 사용자 관리</Text>
      </View>
      <View style={styles.subTitle}>
        <Text style={styles.count}>
          차단한 사용자 수 {String(users.length).padStart(2, '0')}명
        </Text>
        <HelpIcon width={24} height={24} />
      </View>

      {isError ?
          (
              <SafeAreaView style={styles.center}>
                <Text>데이터 불러오기 실패.</Text>
              </SafeAreaView>
           )
        :
      <FlatList
        data={users}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <RoomApplyCard
            user={item}
            onApprove={() => handleApprove(item.userId)}
            onReject={() => handleReject(item.userId)}
//             disabled={isPending}
            type='block'
          />
        )}
        contentContainerStyle={{paddingVertical: 10}}
        refreshControl={
          <RefreshControl
            refreshing={refreshing || isRefetching}
            onRefresh={onRefresh}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>차단한 유저가 없어요.</Text>
          </View>
        }
      />
      }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    height: 58,
    gap: 12,
  },
  sectionTitle: {
    fontFamily: 'Noto Sans KR',
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '600',
    color: colors.GRAY_600,
  },
  subTitle: {
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  count: {
    fontFamily: 'Noto Sans KR',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    color: colors.BLACK,
    letterSpacing: 0.2,
  },
  empty: {paddingVertical: 40, alignItems: 'center'},
  emptyText: {color: colors.GRAY_400, fontSize: 13},
});

