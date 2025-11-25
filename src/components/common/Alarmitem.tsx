import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {colors} from '@/constants';

type Props = {
  type?: string;
  title: string;
  content: string;
  profileUri?: string | null;
};

export default function AlarmitemAlertitem({
  type = '공지사항',
  title,
  content,
  profileUri,
}: Props) {
  return (
    <View style={s.container}>
      {profileUri ? (
        <Image source={{uri: profileUri}} style={s.avatar} />
      ) : (
        <View style={s.avatar} />
      )}

      <View style={s.contentWrapper}>
        <Text style={s.typeText}>{type}</Text>
        <Text style={s.titleText}>{title}</Text>
        <Text style={s.contentText}>{content}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    gap: 11,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.GRAY_200,
  },
  contentWrapper: {
    backgroundColor: 'transparent',
    flex: 1,
    gap: 6,
  },
  typeText: {
    color: colors.GRAY_500,
    fontSize: 12,
  },
  titleText: {
    fontSize: 15, // reduce so it wraps comfortably
    color: colors.BLACK,
    fontWeight: 'bold',
    flexShrink: 1,
  },
  contentText: {
    fontSize: 14,
    color: colors.GRAY_600,
    lineHeight: 24,
    marginTop: 6,
    flexShrink: 1,
  },
});
