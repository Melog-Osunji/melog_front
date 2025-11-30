import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import CommentItem from './CommentItem';
import type {CommentsDTO} from '@/types';

interface CommentListProps {
  commentsData: CommentsDTO;
  totalCommentCount: number;
  postId: string;
  userId: string;
  onReply?: (target: {commentId: string; nickname: string}) => void;
}

const CommentList = ({
  commentsData,
  totalCommentCount,
  postId,
  userId,
  onReply
}: CommentListProps) => {
  const comments = commentsData?.comments || [];
  return (
    <View style={styles.container}>
      <Text style={styles.header}>댓글 {totalCommentCount}</Text>

      <View style={{height: 16}} />

      {comments.map((comment, index) => (
        <View key={`${comment.userID}-${index}`}>
          <CommentItem
            comment={comment}
            postId={postId}
            userId={userId}
            onReply={onReply}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default CommentList;
