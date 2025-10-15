import React from 'react';
import {FlatList, ListRenderItem} from 'react-native';
import PostCard from '@/components/post/PostCard';
import {PostWithUserDTO} from '@/types';

interface PostListProps {
  data: PostWithUserDTO[];
  ListHeaderComponent?:
    | React.ComponentType<any>
    | React.ReactElement
    | null
    | undefined;
}

function PostList({data, ListHeaderComponent}: PostListProps) {
  const renderItem: ListRenderItem<PostWithUserDTO> = ({item}) => (
    <PostCard post={item.post} user={item.user} />
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
