import React from 'react';
import {
    ScrollView,
    Text,
    Dimensions,
    TouchableOpacity,
    View,
    StyleSheet,
    ActivityIndicator,
    Keyboard,
    FlatList
} from 'react-native';
import styled from 'styled-components/native';
import {colors} from '@/constants';
import {useHideTabBarOnFocus} from '@/hooks/common/roadBottomNavigationBar';
import { useHarmonySearch } from '@/hooks/queries/harmonyRoom/useHarmonyRoomGet';
import EmptyTab from '@/components/search/EmptyTab';
import RecommendCard from '@/components/harmonyRoom/RecommendCard';


type Props = {keyword?: string};

const SearchResultHarmonyTab: React.FC<Props> = ({keyword}) => {
  useHideTabBarOnFocus();

  const { data, isLoading, isError } = useHarmonySearch(keyword);

  if (isLoading) {
    return (
    <View style={styles.center}>
      <ActivityIndicator />
      <Text style={{marginTop: 8, color: colors.GRAY_400}}>불러오는 중…</Text>
    </View>
    );
  }

  if (isError || !data) {
    return <EmptyTab keyword={keyword} fullScreen />;
  }

  if (data.length === 0) {
    return <EmptyTab keyword={keyword} fullScreen />;
  }



  return (
    <View style={styles.content}>
        <FlatList
            data={data}
            keyExtractor={item => item.id}
            renderItem={({item}) => <RecommendCard data={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ gap: 16, paddingVertical: 16, }}
        />
    </View>
  );
};

const styles = StyleSheet.create({
  center:{
    marginTop: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 20,
  },
});

export default SearchResultHarmonyTab;
