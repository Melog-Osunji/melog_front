import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import axiosInstance from '@/api/axiosInstance';
import {Post} from '@/constants/types';
import {StackScreenProps} from '@react-navigation/stack';
import {PostStackParamList} from '@/navigations/stack/PostStackNavigator';
import IconButton from '@/components/common/IconButton';
import PostList from '@/components/post/PostList';
import {View, Text, StyleSheet} from 'react-native';
import {mockPosts} from '@/constants/types'; // 더미 데이터
import {colors, postNavigations} from '@/constants';
import {usePostContext} from '@/contexts/PostContext';

type IntroScreenProps = StackScreenProps<
  PostStackParamList,
  typeof postNavigations.POST_HOME
>;

function PostHomeScreen({navigation}: IntroScreenProps) {
  const {posts: newPosts} = usePostContext();

  // 새로운 포스트들과 기존 mockPosts를 합침 (새 포스트가 위에 표시됨)
  const allPosts = [...newPosts, ...mockPosts];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitleText}>추천 피드</Text>
        <View style={styles.headerIconRow}>
          <IconButton<PostStackParamList>
            imageSource={require('@/assets/icons/post/Search.png')}
            target={[postNavigations.POST_SEARCH]}
          />
          <IconButton<PostStackParamList>
            imageSource={require('@/assets/icons/post/Notice.png')}
            target={[postNavigations.POST_SEARCH]}
          />
        </View>
      </View>

      <PostList data={allPosts} />

      {/* Write 버튼 */}
      <View style={styles.writeButton}>
        <IconButton<PostStackParamList>
          imageSource={require('@/assets/icons/post/Write.png')}
          target={[postNavigations.POST_CREATE]}
          size={72}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.WHITE,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY_100,
  },
  headerTitleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.BLACK,
  },
  headerIconRow: {
    flexDirection: 'row',
    gap: 8,
  },
  writeButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PostHomeScreen;
