import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import IconButton from '@/components/common/IconButton';
import {colors} from '@/constants';

/**
 * 문의 항목 화면
 * - 헤더는 NoticesScreen과 동일한 스타일을 사용
 * - 각 항목은 터치 가능한 카드로 표시 (onPress에 네비게이션 연결 가능)
 */
export default function SupportScreen() {
  const handlePress = (key: 'service' | 'feature' | 'other') => {
    // TODO: 네비게이션 연결: navigation.navigate('SomeScreen', {type: key})
    console.log('[SupportScreen] press:', key);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <IconButton
          imageSource={require('@/assets/icons/post/BackArrow.png')}
          target={'goBack'}
          size={24}
        />
        <Text style={styles.title}>문의하기</Text>
      </View>

      <View style={styles.body}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.card}
          onPress={() => handlePress('service')}>
          <Text style={styles.cardTitle}>서비스 문의</Text>
          <Text style={styles.cardSubtitle}>
            서비스 이용 방법, 기능 오류, 약관 및 정책 질문
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.card}
          onPress={() => handlePress('feature')}>
          <Text style={styles.cardTitle}>기능 제안</Text>
          <Text style={styles.cardSubtitle}>
            새로운 기능, 기존 기능 개선, 서비스 제안
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.card}
          onPress={() => handlePress('other')}>
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
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY_100,
    backgroundColor: 'transparent',
  },
  title: {fontSize: 18, color: colors.BLACK, fontWeight: '700'},
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
