import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors} from '@/constants';
import SettingHeader from '@/components/settings/SettingHeader';
import SwitchToggle from '@/components/common/SwitchToggle';

export default function ActivityScopeScreen() {
  const [value, setValue] = useState(false);

  return (
    <View style={styles.screen}>
      <SettingHeader title="나의 활동 범위" />
      <View style={styles.body}>
        <Text style={styles.h2}>내 계정</Text>
        <View style={styles.container}>
          <View style={styles.btn_container}>
            <Text style={styles.h1}>비공개 설정</Text>
            <SwitchToggle value={value} onValueChange={setValue} size="md" />
          </View>
          <Text style={styles.h3}>
            내 팔로워 혹은 내가 승인한 사용자만 내 피드를 볼 수 있습니다.
            {'\n\n'}프로필 사진, 사용자 이름 등의 전반적인 정보는 ‘Melog’의 모든
            사용자가 확인할 수 있습니다.{'\n\n'}팔로워는 내 게시물을 공유할 수
            없습니다.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.WHITE},
  body: {flex: 1, paddingVertical: 10, paddingHorizontal: 20},
  container: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 10,
  },
  btn_container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  h1: {
    color: colors.BLACK,
    fontFamily: 'Noto Sans KR',
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 20,
    letterSpacing: 0.2,
  },
  h2: {
    color: colors.BLACK,
    fontFamily: 'Noto Sans KR',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.2,
  },
  h3: {
    color: colors.GRAY_400,
    fontFamily: 'Noto Sans KR',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.2,
  },
});
