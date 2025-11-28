import React, {useCallback} from 'react';
import {FlatList, ListRenderItem} from 'react-native';
import PostCard from '@/components/post/PostCard';
import {PostWithUserDTO} from '@/types';
import PullToRefresh from 'react-native-pull-to-refresh-custom';
import LoadingHeader from '@/components/common/LoadingHeader';
import {colors} from '@/constants';

interface PostListProps {
  data: PostWithUserDTO[];
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
  onHide?: (userId: string) => void;
  onBlock?: (userId: string) => void;
  onReport?: (postId: string) => void;
  refreshing?: boolean;
  onRefresh?: () => Promise<void>;
}

function PostList({
  data,
  ListHeaderComponent,
  onHide,
  onBlock,
  onReport,
  refreshing = false,
  onRefresh,
}: PostListProps) {
  onRefresh =
    onRefresh ||
    (() => {
      console.log('Refresh triggered');
      return Promise.resolve();
    });

  // memoize renderItem so it has stable identity between renders
  const renderItem: ListRenderItem<PostWithUserDTO> = useCallback(
    ({item}) => (
      <PostCard
        post={item.post}
        user={item.user}
        onHide={onHide}
        onBlock={onBlock}
        onReport={onReport}
      />
    ),
    // keep deps minimal and stable
    [onHide, onBlock, onReport],
  );

  return (
    <PullToRefresh
      HeaderComponent={LoadingHeader}
      headerHeight={60}
      refreshTriggerHeight={40}
      refreshingHoldHeight={60}
      refreshing={refreshing}
      onRefresh={onRefresh}
      style={{flex: 1, backgroundColor: colors.WHITE}}>
      <FlatList
        data={data}
        keyExtractor={(item: PostWithUserDTO) => item.post.id}
        style={{flex: 1}}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        // Performance tuning
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        updateCellsBatchingPeriod={50}
        removeClippedSubviews={true}
        // If items have fixed height, implement getItemLayout for big perf win:
        // getItemLayout={(_, index) => ({length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index})}
      />
    </PullToRefresh>
  );
}

export default PostList;
