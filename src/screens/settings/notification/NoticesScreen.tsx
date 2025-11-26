import React from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';

import {colors} from '@/constants';

import IconButton from '@/components/common/IconButton';
import Alarmlist from '@/components/common/Alarmlist';
import {useNotices} from '@/hooks/queries/settings/useSettingsQueries';

export default function NoticesScreen() {
  const {data, isLoading, error} = useNotices();

  if (isLoading) {
    return (
      <View
        style={[
          styles.screen,
          {justifyContent: 'center', alignItems: 'center'},
        ]}>
        <ActivityIndicator size="large" color={colors.BLUE_400} />
      </View>
    );
  }

  if (error) {
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
          <Text style={{color: colors.GRAY_500}}>
            알림을 불러오는 중 오류가 발생했습니다.
          </Text>
        </View>
      </View>
    );
  }

  const items = (data?.notices ?? []).map(n => ({
    id: n.id,
    type: n.category ?? '공지사항',
    title: n.title,
    content: n.content,
    profileUri: n.imageUrl ?? null,
  }));

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
        <Alarmlist data={items} />
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
