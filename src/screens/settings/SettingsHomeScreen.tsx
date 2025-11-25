import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Switch} from 'react-native';
// constants, navigations, contexts
import {settingsNavigations, colors} from '@/constants';
import {StackScreenProps} from '@react-navigation/stack';
import {SettingNavigatorParamList} from '@/navigations/stack/SettingStackNavigator';
import {useAuthContext} from '@/contexts/AuthContext';
// components
import IconButton from '@/components/common/IconButton';
import SettingRow from '@/components/settings/SettingRow';
import SettingToggleRow from '@/components/settings/SettingToggleRow';

type SettingsHomeScreenProps = StackScreenProps<
  SettingNavigatorParamList,
  typeof settingsNavigations.SETTINGS_HOME
>;

export default function PostHomeScreen({navigation}: SettingsHomeScreenProps) {
  const {user: authUser} = useAuthContext();
  const [pushEnabled, setPushEnabled] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton
          imageSource={require('@/assets/icons/post/BackArrow.png')}
          target={'goBack'}
          size={24}
        />
        <Text style={styles.headerTitle}>설정 및 더보기</Text>
      </View>
      <ScrollView style={styles.list}>
        <Text style={styles.sectionTitle}>내 계정</Text>
        <SettingRow label="로그인" />
        <Text style={styles.sectionTitle}>사용자 관리</Text>
        <SettingRow
          label="나의 활동 범위"
          info="공개"
          onPress={() =>
            navigation.navigate(settingsNavigations.ACTIVITY_SCOPE, {
              userId: authUser?.id || '',
            })
          }
        />
        <SettingRow
          label="팔로워 요청 관리"
          onPress={() =>
            navigation.navigate(settingsNavigations.FOLLOWER_REQUESTS, {
              userId: authUser?.id || '',
            })
          }
        />
        <SettingRow
          label="차단한 사용자 관리"
          onPress={() =>
            navigation.navigate(settingsNavigations.BLOCKED_USERS, {
              userId: authUser?.id || '',
            })
          }
        />

        <Text style={styles.sectionTitle}>알림</Text>
        <SettingToggleRow
          label="PUSH 알림 설정"
          info="본 설정은 해당 기기에서만 유효하며,
수신 거절 시 상담/답변 등의 정보성 알림도 발송되지 않습니다."
          onPress={() => navigation.navigate(settingsNavigations.NOTICES)}
        />

        <SettingRow
          label="공지사항"
          onPress={() => navigation.navigate(settingsNavigations.NOTICES)}
        />

        <SettingRow
          label="문의하기"
          onPress={() =>
            navigation.navigate(settingsNavigations.SUPPORT, {
              userId: authUser?.id || '',
            })
          }
        />

        <Text style={styles.sectionTitle}>서비스 정보</Text>
        <SettingRow
          label="이용약관"
          onPress={() =>
            navigation.navigate(settingsNavigations.TERMS_OF_SERVICE)
          }
        />
        <SettingRow
          label="개인정보 처리방침"
          onPress={() =>
            navigation.navigate(settingsNavigations.PRIVACY_POLICY)
          }
        />

        <Text style={styles.sectionTitle}>기타</Text>
        <SettingRow
          label="언어 설정"
          onPress={() =>
            navigation.navigate(settingsNavigations.LANGUAGE_SETTING)
          }
        />

        <SettingRow
          label="Melog 리뷰 남기기"
          onPress={() => {
            /* open store link - placeholder */
          }}
        />

        <SettingRow
          label="로그아웃"
          onPress={() => {
            /* TODO: logout flow */
          }}
        />

        <SettingRow
          label="탈퇴하기"
          onPress={() =>
            navigation.navigate(settingsNavigations.ACCOUNT_DELETE, {
              userId: authUser?.id || '',
            })
          }
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FFF', paddingBottom: 80},
  header: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {color: colors.BLACK, fontSize: 18, fontWeight: '600'},
  list: {flex: 1},
  sectionTitle: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
    color: colors.BLACK,
    fontSize: 12,
  },
});
