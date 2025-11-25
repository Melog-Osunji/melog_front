import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors } from '@/constants';

export type ApplyUser = {
  id: string;
  name: string;
  intro: string;
  avatarUri?: string;
};

type Props = {
  user: ApplyUser;
  onApprove: (id: string) => void;
  onReject?: (id: string) => void;
  type: 'apply' | 'block';
};

const RoomApplyCard: React.FC<Props> = ({ user, onApprove, onReject, type }) => {

  const isBlocked = true;

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {user.avatarUri ? (
          <Image source={{ uri: user.avatarUri }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder} />
        )}
        <View style={styles.texts}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.intro} numberOfLines={1}>
            {user.intro}
          </Text>
        </View>
      </View>
      {type === 'apply'? (
          <View style={styles.actions}>
              <TouchableOpacity onPress={() => onApprove(user.id)}>
                <Image
                  source={require('@/assets/icons/harmonyRoom/Access.png')}
                  style={styles.icon}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onReject(user.id)}>
                <Image
                  source={require('@/assets/icons/harmonyRoom/Reject.png')}
                  style={[styles.icon, { tintColor: colors.RED_500 }]}
                />
              </TouchableOpacity>
            </View>
          ) : (
              <TouchableOpacity onPress={() => {
                  if (isBlocked) {
                    onApprove(user.id); // ← 예: 차단 해제
                  } else {
                    onReject(user.id);  // ← 예: 차단하기
                  }
                }}
                style={[
                  styles.blockBtn,
                  isBlocked
                   ? { borderColor: colors.RED_300 }
                   : { borderColor: colors.GRAY_500 }
                  ]}
               >
                <Text style={[
                      styles.followLabel,
                      isBlocked
                        ? { color: colors.RED_300 }
                        : { color: colors.GRAY_500 }
                    ]}>
                    {isBlocked ? '차단해제' : '차단하기'}
                </Text>
            </TouchableOpacity>
            )
      }

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.GRAY_200,
  },
  texts: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontFamily: 'Noto Sans KR',
    fontSize: 15,
    lineHeight:22,
    fontWeight: '500',
    color: colors.GRAY_600,
    letterSpacing: 0.15,
  },
  intro: {
    fontFamily: 'Noto Sans KR',
    fontSize: 14,
    lineHeight:20,
    fontWeight: '400',
    color: colors.GRAY_500,
    letterSpacing: 0.2,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  icon: {
    width: 28,
    height: 28,
  },
  blockBtn: {
    height: 36,
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: colors.WHITE,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.RED_300,
  },
  followLabel: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: 0.2,
    color: colors.RED_300,
  },
});

export default RoomApplyCard;
