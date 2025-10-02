import React, {useState, useEffect, useMemo, useCallback} from 'react';
import {StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    Platform,
    FlatList,
    Pressable,
    ActivityIndicator
    } from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {HarmonyStackParamList} from '@/navigations/stack/HarmonyStackNavigator';
import styled from 'styled-components/native';
import {colors, harmonyNavigations} from '@/constants';
import IconButton from '@/components/common/IconButton';
import {useHideTabBarOnFocus} from '@/utils/roadBottomNavigationBar';
import { useHarmonyRoomContext } from '@/contexts/HarmonyRoomContext';
import HarmonyRoomRowCard, { Community } from '@/components/harmonyRoom/HarmonyRoomRowCard';
import {
  useMyHarmonyRoomAll,
} from '@/hooks/queries/harmonyRoom/useHarmonyRoomGet';

const DEVICE_WIDTH = Dimensions.get('window').width;

type NavigationProp = StackNavigationProp<HarmonyStackParamList>;

type HarmonySettingRouteProp = StackScreenProps<
  HarmonyStackParamList,
  'HARMONY_LIST'
>['route'];

const koCompare = (a: string, b: string) => {
  try { return a.localeCompare(b, 'ko'); } catch { return a < b ? -1 : a > b ? 1 : 0; }
};


function HarmonyListScreen(){
    useHideTabBarOnFocus();

    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<HarmonySettingRouteProp>();
    const { rooms } = useHarmonyRoomContext(); // [{id,name,tags,...}[]] 라고 가정

    const {
        data: myRoomsDTO,
        isLoading,
        isError,
        refetch,
      } = useMyHarmonyRoomAll();

    const [refreshing, setRefreshing] = useState(false);
      const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try { await refetch(); } finally { setRefreshing(false); }
    }, [refetch]);

    const bookmarkIdSet = useMemo(() => {
        const src = Array.isArray(myRoomsDTO?.bookmarkHarmony)
          ? myRoomsDTO?.bookmarkHarmony
          : (myRoomsDTO?.bookmarkHarmony ? [myRoomsDTO.bookmarkHarmony] : []);
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
          tags: [],           // 서버에 태그 없으니 빈배열
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
        const ownersSorted = owners.sort((a,b) => koCompare(a.name, b.name));
        const favs = [...owners, ...joined]
          .filter(c => c.isFavorite && !c.isOwner) // 운영은 이미 owners로 분류됨
          .sort((a,b) => koCompare(a.name, b.name));
        const others = [...joined]
          .filter(c => !c.isFavorite && !c.isOwner)
          .sort((a,b) => koCompare(a.name, b.name));

        return [...ownersSorted, ...favs, ...others];
    }, [myRoomsDTO, bookmarkIdSet]);

    const handlePress = (id: string) => {
        navigation.navigate(harmonyNavigations.HARMONY_PAGE, { roomID: id });
    };

    const handleToggleFavorite = (id: string, next: boolean) => {
        // TODO: 서버/전역상태 갱신 필요 시 여기에 로직 추가
        // e.g., mutate(`/rooms/${id}/favorite`, { favorite: next })
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
                <Text style={styles.sectionTitle}>나의 하모니룸 전체<Text style={styles.totalNum}> {String(data.length).padStart(2,'0')}</Text></Text>
            </View>

            <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <HarmonyRoomRowCard
                    item={item}
                    onPress={handlePress}
                    onToggleFavorite={handleToggleFavorite}
                  />
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 16 }}
              />

        </SafeAreaView>
    );
};

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
        height:58,
        gap: 12,
    },
    sectionTitle: {
        fontSize: 17,
        lineHeight:24,
        fontWeight: '600',
        color: colors.GRAY_600,
    },
    totalNum: {
        color:colors.GRAY_300,
    },
});

export default HarmonyListScreen;