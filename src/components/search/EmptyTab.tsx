import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors } from '@/constants';

type Props = {
  keyword?: string;
  subtitle?: string;
  fullScreen?: boolean;
  topInset?: number;
};

const EmptyTab: React.FC<Props> = ({
      keyword,
      subtitle = '원하는 결과를 찾기 위해 다른 검색어를 실행하거나 검색 전 카테고리를 사용해봐요!',
      fullScreen = true,
      topInset = 0,
    }) => {
    const title = keyword ? `"${keyword}"` + '와(과) 일치하는 검색 결과가 없어요' : '아직 작성된 피드가 없어요.';
    return (
        <View
          style={[
            styles.wrap,
            fullScreen && styles.full,
            topInset ? { paddingTop: topInset } : null,
          ]}
        >
          <Image source={require('@/assets/icons/post/EmptyIcon.png')} style={styles.icon} resizeMode="contain" />
          <Text style={styles.title}>{title}</Text>
          {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
    );
}

export default EmptyTab;


const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  full: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  icon: {
      height: 48,
      marginBottom: 13,
  },
  title: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
    letterSpacing: 0.15,
    color: colors.GRAY_500,
    marginBottom:12,
  },
  subtitle: {
    width: 266,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    letterSpacing: 0.2,
    color: colors.GRAY_300,
    textAlign: 'center',
  },
});