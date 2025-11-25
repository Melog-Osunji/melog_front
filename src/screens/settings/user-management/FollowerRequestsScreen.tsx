import React, {useMemo, useRef, useState} from 'react';
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
import {useHideTabBarOnFocus} from '@/hooks/common/roadBottomNavigationBar';
import {colors} from '@/constants';
import {useQueryClient} from '@tanstack/react-query';

const DEVICE_WIDTH = Dimensions.get('window').width;

// type NavigationProp = StackNavigationProp<HarmonyStackParamList>;
//
// type HarmonySettingRouteProp = StackScreenProps<
//   HarmonyStackParamList,
//   'HARMONY_APPLY'
// >['route'];


export default function FollowerRequestsScreen() {
//   const navigation = useNavigation<NavigationProp>();
//   const route = useRoute<HarmonySettingRouteProp>();
  const qc = useQueryClient();

  // 1) 대기자 목록 조회
//   const {
//     data: waitingDTO,
//     isLoading,
//     isError,
//     error,
//     refetch,
//     isRefetching,
//   } = useWaitingUserList(roomID);

  // 2) 승인/거부 - 수정
//   const {mutateAsync: updateMembership, isPending} =
//     useUpdateHarmonyMembership(roomID);

//   const [refreshing, setRefreshing] = useState(false);
//   const onRefresh = useCallback(async () => {
//     setRefreshing(true);
//     try {
//       await refetch();
//     } finally {
//       setRefreshing(false);
//     }
//   }, [refetch]);

//   const users: ApplyUser[] = useMemo(() => {
//     const src = waitingDTO?.waitingUsers ?? [];
//     return src.map(u => ({
//       id: String(u.user.id),
//       name: u.user.nickname ?? '익명',
//       intro: u.user.intro ?? '',
//       profileImgLink: u.user.profileImgLink, // RoomApplyCard가 받는다면 그대로 전달
//     }));
//   }, [waitingDTO]);

//   const listKey = useMemo(() => ['harmony', 'waiting', roomID], [roomID]);

  const handleApprove = async (userId: string) => {
//     if (isPending) return; // 중복 클릭 방지
//
//     // 스냅샷
//     const prev = qc.getQueryData<any>(listKey);
//
//     try {
//       qc.setQueryData<any>(listKey, old => {
//         if (!old) return old;
//         const next = Array.isArray(old.user)
//           ? old.user.filter((u: any) => String(u.id) !== String(userId))
//           : [];
//         return {...old, user: next};
//       });
//
//       // 서버 호출
//       await updateMembership({action: 'approve', userID: userId});
//     } catch (e) {
//       // 롤백
//       qc.setQueryData(listKey, prev);
//     }
  };

  const handleReject = async (userId: string) => {
//     if (isPending) return;
//
//     const prev = qc.getQueryData<any>(listKey);
//
//     try {
//       qc.setQueryData<any>(listKey, old => {
//         if (!old) return old;
//         const next = Array.isArray(old.user)
//           ? old.user.filter((u: any) => String(u.id) !== String(userId))
//           : [];
//         return {...old, user: next};
//       });
//
//       await updateMembership({action: 'deny', userID: userId});
//     } catch (e) {
//       qc.setQueryData(listKey, prev);
//     }
  };

  if (isLoading && !waitingDTO) {
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
        <Text style={styles.sectionTitle}>팔로워 요청 관리</Text>
      </View>
      <View style={styles.subTitle}>
        <Text style={styles.count}>
          팔로워 요청자 수 {String(users.length).padStart(2, '0')}명
        </Text>
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
            onApprove={() => handleApprove(item.id)}
            onReject={() => handleReject(item.id)}
            disabled={isPending}
            type='apply'
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
            <Text style={styles.emptyText}>팔로우를 요청한 유저가 없어요.</Text>
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
