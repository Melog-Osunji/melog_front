import React, {useState, useEffect, useMemo} from 'react';
import {StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    Platform,
    FlatList,
    Pressable
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

const DEVICE_WIDTH = Dimensions.get('window').width;

type NavigationProp = StackNavigationProp<HarmonyStackParamList>;

type HarmonySettingRouteProp = StackScreenProps<
  HarmonyStackParamList,
  'HARMONY_LIST'
>['route'];

const koCompare = (a: string, b: string) => {
  try { return a.localeCompare(b, 'ko'); } catch { return a < b ? -1 : a > b ? 1 : 0; }
};

const MOCK_ROOMS: Community[] = [
  {
    id: 'room1',
    name: '클래식 감상 모임',
    tags: ['베토벤', '교향곡'],
    coverUri: 'https://picsum.photos/200/200?random=1',
    isOwner: true,
    isFavorite: true,
  },
  {
    id: 'room2',
    name: '라흐마니노프 팬클럽',
    tags: ['라흐마니노프', '피아노'],
    coverUri: 'https://picsum.photos/200/200?random=2',
    isOwner: false,
    isFavorite: false,
  },
  {
    id: 'room3',
    name: '낭만주의 음악방',
    tags: ['낭만주의', '리스트'],
    coverUri: 'https://picsum.photos/200/200?random=3',
    isOwner: false,
    isFavorite: true,
  },
];

function HarmonyListScreen(){
    useHideTabBarOnFocus();

    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<HarmonySettingRouteProp>();
    const { rooms } = useHarmonyRoomContext(); // [{id,name,tags,...}[]] 라고 가정

    const data: Community[] = useMemo(() => {
      const communities = (rooms?.length ? rooms : MOCK_ROOMS) as Community[];

      const owners = communities.filter(c => c.isOwner).sort((a, b) => koCompare(a.name, b.name));
      const favs   = communities.filter(c => c.isFavorite && !c.isOwner).sort((a, b) => koCompare(a.name, b.name));
      const others = communities.filter(c => !c.isOwner && !c.isFavorite).sort((a, b) => koCompare(a.name, b.name));

      return [...owners, ...favs, ...others];
    }, [rooms]);

    const handlePress = (id: string) => {
        navigation.navigate(harmonyNavigations.HARMONY_PAGE, { roomID: id });
    };

    const handleToggleFavorite = (id: string, next: boolean) => {
        // TODO: 서버/전역상태 갱신 필요 시 여기에 로직 추가
        // e.g., mutate(`/rooms/${id}/favorite`, { favorite: next })
    };

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