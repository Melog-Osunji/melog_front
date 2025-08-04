import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import axiosInstance from '@/api/axiosInstance';
import {Post, FeedType, feedTypes} from '@/constants/types';
import {StackScreenProps} from '@react-navigation/stack';
import {PostStackParamList} from '@/navigations/stack/PostStackNavigator';
import IconButton from '@/components/common/IconButton';
import PostList from '@/components/post/PostList';
import FeedSelector from '@/components/post/FeedSelector';
import {View, StyleSheet} from 'react-native';
import {colors, postNavigations} from '@/constants';
import {usePostContext} from '@/contexts/PostContext';

type IntroScreenProps = StackScreenProps<
  PostStackParamList,
  typeof postNavigations.POST_HOME
>;

function PostHomeScreen({navigation}: IntroScreenProps) {
  const {posts: newPosts} = usePostContext();
  const [selectedFeed, setSelectedFeed] = useState<FeedType>(feedTypes[0]);

  // 선택된 피드의 포스트를 표시, 없으면 새 포스트 표시
  const allPosts =
    selectedFeed.posts && selectedFeed.posts.length > 0
      ? selectedFeed.posts
      : newPosts.length > 0
      ? newPosts
      : selectedFeed.posts || [];

  // 디버깅용 로그
  console.log('PostHomeScreen - selectedFeed:', selectedFeed);
  console.log('PostHomeScreen - allPosts length:', allPosts.length);
  console.log('PostHomeScreen - newPosts length:', newPosts.length);
  console.log(
    'PostHomeScreen - selectedFeed.posts length:',
    selectedFeed.posts?.length || 0,
  );

  const handleFeedSelect = (feed: FeedType) => {
    setSelectedFeed(feed);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <FeedSelector
          selectedFeed={selectedFeed}
          onFeedSelect={handleFeedSelect}
        />
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
