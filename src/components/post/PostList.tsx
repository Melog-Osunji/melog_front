import React from 'react';
import {FlatList, ListRenderItem} from 'react-native';
import PostCard from '@/components/post/PostCard';
import {Post} from '@/constants/types';

interface PostListProps {
  data: Post[];
  ListHeaderComponent?:
    | React.ComponentType<any>
    | React.ReactElement
    | null
    | undefined;
}

function PostList({data, ListHeaderComponent}: PostListProps) {
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
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={ListHeaderComponent}
    />
  );
}

export default PostList;
