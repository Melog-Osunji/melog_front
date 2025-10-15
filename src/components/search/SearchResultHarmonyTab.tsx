import React from 'react';
import {ScrollView, Text, StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import {colors} from '@/constants';
import {useHideTabBarOnFocus} from '@/hooks/common/roadBottomNavigationBar';

type Props = {keyword?: string};

const SearchResultHarmonyTab: React.FC<Props> = ({keyword}) => {
  useHideTabBarOnFocus();
  return (
    <ScrollView contentContainerStyle={styles.content}>
      {/* 카테고리 선택 */}
      <Text>hello</Text>
      {/* 피드 */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
});

export default SearchResultHarmonyTab;
