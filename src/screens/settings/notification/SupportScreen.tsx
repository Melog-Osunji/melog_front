import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {settingsNavigations} from '@/constants';
import {SettingStackParamList} from '@/navigations/stack/SettingStackNavigator';
import SettingHeader from '@/components/settings/SettingHeader';
import {ParentType} from '@/constants/Support';

import {colors} from '@/constants';

type SupportScreenProps = StackScreenProps<
  SettingStackParamList,
  typeof settingsNavigations.SUPPORT_FORM
>;

export default function SupportScreen({navigation}: SupportScreenProps) {
  const handlePress = (key: ParentType) => {
    navigation.navigate(settingsNavigations.SUPPORT_FORM, {type: key});
    console.log('[SupportScreen] press:', key);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <SettingHeader title="문의하기" />

      <View style={styles.body}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.card}
          onPress={() => handlePress(ParentType.ACCOUNT)}>
          <Text style={styles.cardTitle}>서비스 문의</Text>
          <Text style={styles.cardSubtitle}>
            서비스 이용 방법, 기능 오류, 약관 및 정책 질문
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.card}
          onPress={() => handlePress(ParentType.SUGGESTION)}>
          <Text style={styles.cardTitle}>기능 제안</Text>
          <Text style={styles.cardSubtitle}>
            새로운 기능, 기존 기능 개선, 서비스 제안
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.card}
          onPress={() => handlePress(ParentType.OTHER)}>
          <Text style={styles.cardTitle}>기타</Text>
          <Text style={styles.cardSubtitle}>
            비즈니스 협업, 마케팅/콘텐츠 제휴 등
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.WHITE},
  body: {
    paddingHorizontal: 20,
    paddingTop: 40,
    gap: 12,
  },
  card: {
    backgroundColor: colors.GRAY_100,
    borderRadius: 8,
    padding: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.GRAY_400,
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 12,
    color: colors.GRAY_400,
    lineHeight: 20,
  },
});
