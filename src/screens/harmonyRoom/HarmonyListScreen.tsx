import React, {useState, useEffect, useMemo, useCallback} from 'react';
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
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {HarmonyStackParamList} from '@/navigations/stack/HarmonyStackNavigator';
import styled from 'styled-components/native';
import {colors, harmonyNavigations} from '@/constants';
import IconButton from '@/components/common/IconButton';
import {useHideTabBarOnFocus} from '@/hooks/common/roadBottomNavigationBar';
import {useHarmonyRoomContext} from '@/contexts/HarmonyRoomContext';
import HarmonyRoomRowCard, {
  Community,
} from '@/components/harmonyRoom/HarmonyRoomRowCard';
import {useMyHarmonyRoomAll} from '@/hooks/queries/harmonyRoom/useHarmonyRoomGet';
import {useBookmarkHarmonyRoom} from '@/hooks/queries/harmonyRoom/useHarmonyRoomPost';
import {useQueryClient} from '@tanstack/react-query';
import {RefreshControl} from 'react-native';

const DEVICE_WIDTH = Dimensions.get('window').width;

type NavigationProp = StackNavigationProp<HarmonyStackParamList>;

type HarmonySettingRouteProp = StackScreenProps<
  HarmonyStackParamList,
  'HARMONY_LIST'
>['route'];

const koCompare = (a: string, b: string) => {
  try {
    return a.localeCompare(b, 'ko');
  } catch {
    return a < b ? -1 : a > b ? 1 : 0;
  }
};

function HarmonyListScreen() {
  useHideTabBarOnFocus();

  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<HarmonySettingRouteProp>();
  const {rooms} = useHarmonyRoomContext(); // [{id,name,tags,...}[]] 라고 가정
  const qc = useQueryClient();

  const {data: myRoomsDTO, isLoading, isError, refetch} = useMyHarmonyRoomAll();
  const {mutateAsync: toggleBookmark, isPending: bookmarkLoading} =
    useBookmarkHarmonyRoom();

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const bookmarkIdSet = useMemo(() => {
    const src = Array.isArray(myRoomsDTO?.bookmarkHarmony)
      ? myRoomsDTO?.bookmarkHarmony
      : myRoomsDTO?.bookmarkHarmony
      ? [myRoomsDTO.bookmarkHarmony]
      : [];
    const set = new Set<string>();
    (src ?? []).forEach((r: any) => r?.id && set.add(r.id));
    return set;
  }, [myRoomsDTO]);

  const data: Community[] = useMemo(() => {
    if (!myRoomsDTO) return [];

    const owners: Community[] = (myRoomsDTO.myHarmony ?? []).map(r => ({
      id: r.id,
      name: r.name,
      coverUri: r.profileImg,
      tags: [], // 서버에 태그 없으니 빈배열
      isOwner: true,
      isFavorite: bookmarkIdSet.has(r.id),
    }));

    const joined: Community[] = (myRoomsDTO.harmony ?? []).map(r => ({
      id: r.id,
      name: r.name,
      coverUri: r.profileImg,
      tags: [],
      isOwner: false,
      isFavorite: bookmarkIdSet.has(r.id),
    }));

    // bookmarkHarmony 항목이 owners/joined에 이미 포함되어 있어도
    // isFavorite 플래그가 위에서 반영되므로 **중복 리스트**를 따로 붙일 필요 없음.

    // 정렬: 운영 → 즐겨찾기 → 기타 (이름 오름차순)
    const ownersSorted = owners.sort((a, b) => koCompare(a.name, b.name));
    const favs = [...owners, ...joined]
      .filter(c => c.isFavorite && !c.isOwner) // 운영은 이미 owners로 분류됨
      .sort((a, b) => koCompare(a.name, b.name));
    const others = [...joined]
      .filter(c => !c.isFavorite && !c.isOwner)
      .sort((a, b) => koCompare(a.name, b.name));

    return [...ownersSorted, ...favs, ...others];
  }, [myRoomsDTO, bookmarkIdSet]);

  const handlePress = (id: string) => {
    navigation.navigate(harmonyNavigations.HARMONY_PAGE, {roomID: id});
  };

  const handleToggleFavorite = async (id: string, next: boolean) => {
    if (!myRoomsDTO || bookmarkLoading) return;

    // 1) 현재 스냅샷
    const myKey = ['harmony', 'my']; // 실제 프로젝트의 HarmonyQueryKeys.my()로 교체
    const prev = qc.getQueryData<any>(myKey);

    try {
      // 2) 낙관적 업데이트
      qc.setQueryData<any>(myKey, old => {
        if (!old) return old;

        const findById = (arr: any[]) =>
          arr?.find(x => String(x.id) === String(id));

        // bookmarkHarmony를 배열로 표준화
        let nextBookmark = Array.isArray(old.bookmarkHarmony)
          ? [...old.bookmarkHarmony]
          : old.bookmarkHarmony
          ? [old.bookmarkHarmony]
          : [];

        // 대상 room(내가 운영/가입 중 어디에 있든) 찾아서 그대로 push/remove
        const inMy = findById(old.myHarmony ?? []);
        const inJoined = findById(old.harmony ?? []);
        const exists = inMy || inJoined;

        if (next) {
          // 추가
          if (exists && !findById(nextBookmark)) nextBookmark.push(exists);
        } else {
          // 제거
          nextBookmark = nextBookmark.filter(
            (x: any) => String(x.id) !== String(id),
          );
        }

        return {...old, bookmarkHarmony: nextBookmark};
      });

      // 3) 서버 호출 (토글 엔드포인트)
      await toggleBookmark(id);

      // 4) 성공 시: 훅 onSuccess에서 invalidate 처리
    } catch (e) {
      // 5) 실패 시 롤백
      qc.setQueryData(myKey, prev);
    }
  };

  if (isLoading && !refreshing) {
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
        <Text style={styles.sectionTitle}>
          나의 하모니룸 전체
          <Text style={styles.totalNum}>
            {' '}
            {String(data.length).padStart(2, '0')}
          </Text>
        </Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <HarmonyRoomRowCard
            item={item}
            onPress={handlePress}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 16}}
      />
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
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '600',
    color: colors.GRAY_600,
  },
  totalNum: {
    color: colors.GRAY_300,
  },
});

export default HarmonyListScreen;
