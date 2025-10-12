import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors} from '@/constants';
import {Comment} from '@/constants/types';
import {mockComments} from '@/constants/dummyData';
import CommentItem from './CommentItem';

interface CommentListProps {
  comments?: Comment[]; // optional로 변경
  totalCommentCount?: number; // optional로 변경
}

const CommentList = ({comments, totalCommentCount}: CommentListProps) => {
  // comments가 없으면 mockComments 사용, 있으면 전달받은 comments 사용
  const safeComments = comments || mockComments;

  // totalCommentCount가 없으면 댓글 배열 길이 사용
  const displayCount = totalCommentCount ?? safeComments.length;

  return (
    <View style={styles.container}>
      {/* 댓글 헤더 */}
      <View style={styles.header}>
        <Text style={styles.commentLabel}>댓글</Text>
        <Text style={styles.commentCount}>
          {displayCount.toString().padStart(2, '0')}
        </Text>
      </View>

      {/* 댓글 목록 */}
      <View style={styles.commentList}>
        {safeComments.map((comment, index) => (
          <View key={comment.id}>
            <CommentItem comment={comment} />

            {/* 대댓글 표시 */}
            {comment.replies && comment.replies.length > 0 && (
              <View style={styles.repliesContainer}>
                {comment.replies.map(reply => (
                  <CommentItem key={reply.id} comment={reply} isReply={true} />
                ))}
              </View>
            )}

            {/* 구분선 (마지막 댓글 제외) */}
            {index < safeComments.length - 1 && (
              <View style={styles.separator} />
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY_100,
    backgroundColor: colors.WHITE,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  commentLabel: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    letterSpacing: 0.2,
    color: colors.GRAY_500,
  },
  commentCount: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    letterSpacing: 0.2,
    color: colors.GRAY_500,
  },
  commentList: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 12,
    width: '100%',
  },
  repliesContainer: {
    marginTop: 12,
    gap: 12,
  },
  separator: {
    height: 12,
  },
});

export default CommentList;
