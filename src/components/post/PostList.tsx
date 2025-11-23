import React from 'react';
import {FlatList, ListRenderItem} from 'react-native';
import PostCard from '@/components/post/PostCard';
import {PostWithUserDTO} from '@/types';

interface PostListProps {
  data: PostWithUserDTO[];
  ListHeaderComponent?: React.ReactNode;
  onHide?: (userId: string) => void;
  onBlock?: (userId: string) => void;
  onReport?: (postId: string) => void;
}

function PostList({
  data,
  ListHeaderComponent,
  onHide,
  onBlock,
  onReport,
}: PostListProps) {
  const renderItem: ListRenderItem<PostWithUserDTO> = ({item}) => (
    <PostCard
      post={item.post}
      user={item.user}
      onHide={onHide} // 전달: PostCard에서 user.id로 호출
      onBlock={onBlock}
      onReport={onReport}
    />
  );

  return (
    <FlatList
      data={data}
      keyExtractor={(item: PostWithUserDTO) => item.post.id}
      style={{width: '100%'}}
      contentContainerStyle={{
        paddingBottom: 80,
      }}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={ListHeaderComponent}
    />
  );
}

export default PostList;
