import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import {colors} from '@/constants';

import IconButton from '@/components/common/IconButton';
import Alarmlist from '@/components/common/Alarmlist';

const DUMMY = [
  {
    id: '1',
    type: '공지사항',
    title: '앱 사용성을 개선했어요.',
    content:
      '게시물에 올리는 글입니다. 게시물에 올리는 글입니다. 게시물에 올리는 글입니다.',
    profileUri: null,
  },
  {
    id: '2',
    type: '공지사항',
    title: '앱 사용성을 개선했어요.',
    content:
      '게시물에 올리는 글입니다. 게시물에 올리는 글입니다. 게시물에 올리는 글입니다.',
    profileUri: null,
  },
  {
    id: '3',
    type: '공지사항',
    title: '앱 사용성을 개선했어요.',
    content:
      '게시물에 올리는 글입니다. 게시물에 올리는 글입니다. 게시물에 올리는 글입니다.',
    profileUri: null,
  },
];

export default function NoticesScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <IconButton
          imageSource={require('@/assets/icons/post/BackArrow.png')}
          target={'goBack'}
          size={24}
        />
        <Text style={styles.title}>공지사항</Text>
      </View>
      <View style={styles.body}>
        <Alarmlist data={DUMMY} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.WHITE},
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  title: {fontSize: 18, color: colors.BLACK, fontWeight: 'bold'},
  body: {flex: 1},
});
