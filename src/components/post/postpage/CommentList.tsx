import React from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import CommentItem from './CommentItem';
import type {CommentsDTO, CommentDTO} from '@/types';

interface CommentListProps {
  commentsData: CommentsDTO;
  totalCommentCount: number;
  postId: string;
  onReply?: (target: {id: string; nickname: string}) => void;
}

const CommentList = ({
  commentsData,
  totalCommentCount,
  postId,
  onReply,
}: CommentListProps) => {
  const comments = commentsData?.comments || [];

  const renderItem = ({item}: {item: CommentDTO}) => (
    <CommentItem
      comment={item}
      postId={postId}
      userId={item.userID}
      onReply={onReply}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>댓글 {totalCommentCount}</Text>
      <View style={{height: 16}} />
      <FlatList
        data={comments}
        renderItem={renderItem}
        keyExtractor={it => it.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 100}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {backgroundColor: '#fff'},
  header: {fontSize: 12},
});

export default CommentList;
