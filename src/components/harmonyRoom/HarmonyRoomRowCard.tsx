import React, { useState, memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '@/constants';

export type Community = {
  id: string;
  name: string;
  coverUri?: string;
  tags: string[];
  isOwner?: boolean;
  isFavorite?: boolean;
};

type Props = {
  item: Community;
  onPress: (id: string) => void;
  onToggleFavorite?: (id: string, next: boolean) => void; // 부모에서 동기화할 때 사용
};

const CIRCLE = 56;
const BORDER = 2;

const HarmonyRoomRowCard: React.FC<Props> = ({ item, onPress, onToggleFavorite }) => {
  const [fav, setFav] = useState(!!item.isFavorite);

  const handleFav = () => {
    const next = !fav;
    setFav(next);
    onToggleFavorite?.(item.id, next);
  };

  return (
    <View style={styles.section}>
      <TouchableOpacity style={styles.room} onPress={() => onPress(item.id)}>
        <View style={styles.avatarWrap}>
          <LinearGradient
            colors={['#64C0E6', '#68E5E5']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={styles.circleGradient}
          >
            <View style={styles.circleInner}>
              {item.coverUri ? (
                <Image source={{ uri: item.coverUri }} style={styles.cover} />
              ) : (
                <View style={styles.placeholder} />
              )}
            </View>

            {item.isOwner ? (
              <View style={styles.ownerBadge}>
                <Text style={styles.ownerBadgeText}>운영</Text>
              </View>
            ) : null}
          </LinearGradient>
        </View>

        <View style={styles.nameAndTags}>
          <Text numberOfLines={1} style={styles.label}>{item.name}</Text>
          {item.tags?.length ? (
            <View style={styles.infoTagRow}>
              <Text style={styles.tag} numberOfLines={1}>
                {item.tags.map(t => `#${t}`).join(' ')}
              </Text>
            </View>
          ) : null}
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleFav} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        {fav ? (
          <Image
            source={require('@/assets/icons/harmonyRoom/FavoriteColor.png')}
            style={styles.iconBtn}
          />
        ) : (
          <Image
            source={require('@/assets/icons/harmonyRoom/Favorite.png')}
            style={[styles.iconBtn, {tintColor: colors.GRAY_300}]}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  room: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  avatarWrap: {
    width: CIRCLE,
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
    width: CIRCLE - BORDER * 2,
    height: CIRCLE - BORDER * 2,
    borderRadius: (CIRCLE - BORDER * 2) / 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
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
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0.2,
    lineHeight: 16,
    color: colors.BLUE_500,
  },
  nameAndTags: {
    gap: 3,
    flex: 1,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: 0.15,
    lineHeight: 22,
    color: colors.GRAY_600,
  },
  infoTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tag: {
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0.2,
    lineHeight: 20,
    color: colors.BLUE_500,
  },
  iconBtn: {
    width: 18,
    height: 18,
  },
});

export default memo(HarmonyRoomRowCard);
