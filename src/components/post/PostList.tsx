import React from 'react';
import {FlatList, ListRenderItem} from 'react-native';
import PostCard from '@/components/post/PostCard';
import {Post} from '@/constants/types';

interface PostListProps {
  data: Post[];
}

function PostList({data}: PostListProps) {
  const renderItem: ListRenderItem<Post> = ({item}) => <PostCard {...item} />;

  return (
    <FlatList
      data={data}
      keyExtractor={(item: Post) => item.id}
      style={{width: '100%'}}
      contentContainerStyle={{
        paddingBottom: 80,
      }}
      renderItem={renderItem}
    />
  );
}

export default PostList;
