import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {View, StyleSheet} from 'react-native';
//constants
import {FeedType, createFeedTypes} from '@/constants/types';
import {colors, postNavigations} from '@/constants';
//navigation
import {StackScreenProps} from '@react-navigation/stack';
import {PostStackParamList} from '@/navigations/stack/PostStackNavigator';
//context
import {usePostContext} from '@/contexts/PostContext';
//components
import PostList from '@/components/post/PostList';
import IconButton from '@/components/common/IconButton';
import FeedSelector from '@/components/post/FeedSelector';
import GradientBg from '@/components/common/styles/GradientBg';
import HaryroomNaviBtn from '@/components/post/HaryroomNaviBtn';

type IntroScreenProps = StackScreenProps<
  PostStackParamList,
  typeof postNavigations.POST_HOME
>;

function PostHomeScreen({navigation}: IntroScreenProps) {
  const {posts: newPosts} = usePostContext();
  const feedTypes = createFeedTypes(newPosts);
  const [selectedFeed, setSelectedFeed] = useState<FeedType>(feedTypes[0]);
  const [selectedRoomId, setSelectedRoomId] = useState<string>('room1');

  // 하모니룸 데이터
  const harmonyRooms = [
    {id: 'room1', name: '하모니룸1'},
    {id: 'room2', name: '하모니룸2'},
    {id: 'room3', name: '하모니룸3'},
    {id: 'room4', name: '하모니룸4'},
  ];

  // 선택된 피드의 포스트를 표시, 없으면 새 포스트 표시
  const allPosts =
    selectedFeed.posts && selectedFeed.posts.length > 0
      ? selectedFeed.posts
      : newPosts.length > 0
      ? newPosts
      : selectedFeed.posts || [];

  const handleFeedSelect = (feed: FeedType) => {
    setSelectedFeed(feed);
  };

  const handleRoomSelect = (roomId: string) => {
    setSelectedRoomId(roomId);
    // 룸 선택에 따른 추가 로직
  };

  return (
    <GradientBg>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <FeedSelector
            selectedFeed={selectedFeed}
            onFeedSelect={handleFeedSelect}
            feedTypes={feedTypes}
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

        <PostList
          data={allPosts}
          ListHeaderComponent={
            <HaryroomNaviBtn
              rooms={harmonyRooms}
              selectedRoomId={selectedRoomId}
              onRoomSelect={handleRoomSelect}
            />
          }
        />

        {/* Write 버튼 */}
        <View style={styles.writeButton}>
          <IconButton<PostStackParamList>
            imageSource={require('@/assets/icons/post/Write.png')}
            target={[postNavigations.POST_CREATE]}
            size={72}
          />
        </View>
      </SafeAreaView>
    </GradientBg>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'transparent',
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
