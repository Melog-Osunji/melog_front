import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { colors } from '@/constants';
import LinearGradient from 'react-native-linear-gradient';
import { HarmonyStackParamList } from '@/navigations/stack/HarmonyStackNavigator';
import { harmonyNavigations } from '@/constants';
import {useNavigation} from '@react-navigation/native';

export type Community = {
  id: string;
  name: string;
  coverUri?: string;     // 썸네일 이미지 있으면 사용
  isOwner?: boolean;     // 내가 운영
  isFavorite?: boolean;  // 즐겨찾기
};

type Props = {
  communities: Community[];
  onChange: (id: 'all' | string) => void;
};

const koCompare = (a: string, b: string) => {
  // RN Hermes에서도 대체로 동작하지만, 혹시 몰라 fallback 처리
  try { return a.localeCompare(b, 'ko'); } catch { return a < b ? -1 : a > b ? 1 : 0; }
};

const HarmonyRoomStrip: React.FC<Props> = ({ communities, onChange }) => {
  const navigation = useNavigation<StackNavigationProp<HarmonyStackParamList>>();

  const data = useMemo(() => {
    const owners = communities.filter(c => c.isOwner).sort((a, b) => koCompare(a.name, b.name));
    const favs = communities
      .filter(c => c.isFavorite && !c.isOwner)
      .sort((a, b) => koCompare(a.name, b.name));
    const others = communities
      .filter(c => !c.isOwner && !c.isFavorite)
      .sort((a, b) => koCompare(a.name, b.name));

    // "전체" 항목을 맨 앞에
    return [{ id: 'all', name: '전체' } as any].concat(owners, favs, others);
  }, [communities]);

  const renderItem = ({ item }: { item: Community | { id: 'all'; name: string } }) => {
    const isAll = item.id === 'all';
    const circleStyle = [
      styles.circle,
    ];

    const handlePress = () => {
      if (isAll) {
        onChange('all');                  // 전체는 필터 변경
      } else {
        const roomID = (item as Community).id; // id를 roomID로 사용
        navigation.navigate(harmonyNavigations.HARMONY_PAGE, { roomID });
      }
    };

    return (
      <TouchableOpacity style={styles.item} onPress={handlePress}>
        <LinearGradient
            colors={['#64C0E6', '#68E5E5']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={styles.circleGradient}
        >
          <View style={styles.circleInner}>
          {isAll ? (
            <View style={styles.grid}>
              <Image source={require('@/assets/icons/harmonyRoom/AllHarmonyRoom.png')} style={styles.icon} />
            </View>
          ) : item.coverUri ? (
            <Image source={{ uri: item.coverUri }} style={styles.cover} />
          ) : (
            <View style={styles.placeholder} />
          )}
        </View>
        {/* 운영 뱃지 */}
        {'isOwner' in item && item.isOwner ? (
            <View style={styles.ownerBadge}>
              <Text style={styles.ownerBadgeText}>운영</Text>
            </View>
          ) : null}
        {/* 즐겨찾기 별 */}
          {'isFavorite' in item && item.isFavorite ? (
            <Image source={require('@/assets/icons/harmonyRoom/FavoriteStar.png')} style={styles.star}/>
          ) : null}
        </LinearGradient>
        <Text
          numberOfLines={1}
          style={styles.label}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
    />
  );
};

const CIRCLE = 56;
const BORDER = 2;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 17,
  },
  item: {
    width: 56, // 라벨까지 고려한 너비
    alignItems: 'center',
  },
  circleGradient: {
    width: CIRCLE,
    height: CIRCLE,
    borderRadius: CIRCLE / 2,
    padding: BORDER,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  circleInner: {
    width: CIRCLE - BORDER * 2,      // ← 내부 원 실제 크기
    height: CIRCLE - BORDER * 2,
    borderRadius: (CIRCLE - BORDER * 2) / 2, // ← 정확한 반지름
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  grid: {
    width: '100%',
    height: '100%',
    borderRadius: (CIRCLE - BORDER * 2) / 2,
    backgroundColor: colors.BLUE_200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cover: {
      width: CIRCLE - BORDER * 2,
      height: CIRCLE - BORDER * 2,
  },
  placeholder: {
    width: '100%',
    height: '100%',
    borderRadius: (CIRCLE - BORDER * 2) / 2,
    backgroundColor: colors.GRAY_200,
  },
  ownerBadge: {
    position: 'absolute',
    bottom: -5,
    backgroundColor: colors.BLUE_200,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingTop: 1,
    paddingBottom: 2,
  },
  ownerBadgeText: {
    fontFamily: 'Noto Sans KR',
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0.2,
    lineHeight: 16,
    color: colors.BLUE_500,
  },
  star: {
    width: 20,
    position: 'absolute',
    top:1,
    right: 0,
  },
  label: {
    marginTop: 5,
    maxWidth: 56,
    textAlign: 'center',
    fontFamily: 'Noto Sans KR',
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0.2,
    lineHeight: 20,
    color: colors.GRAY_600,
  },

});

export default HarmonyRoomStrip;
