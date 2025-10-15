import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {colors} from '@/constants';
import type {CommentDTO} from '@/types';

interface CommentItemProps {
  comment: CommentDTO;
  isReply?: boolean;
}

const CommentItem = ({comment, isReply = false}: CommentItemProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [currentLikeCount, setCurrentLikeCount] = useState(comment.likes);

  const handleLikePress = () => {
    if (isLiked) {
      setCurrentLikeCount(prev => prev - 1);
    } else {
      setCurrentLikeCount(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  return (
    <>
      <View style={[styles.commentContainer, isReply && styles.replyContainer]}>
        <View style={styles.commentContent}>
          {/* 프로필 섹션 */}
          <View style={styles.profileSection}>
            <Image
              source={{uri: comment.profileUrl}}
              style={styles.profileImage}
            />
            <View style={styles.userInfo}>
              <View style={styles.nameTimeRow}>
                <Text style={styles.userName}>사용자</Text>
                <View style={styles.dot} />
                <Text style={styles.timeText}>방금 전</Text>
              </View>
              <Text style={styles.commentText}>{comment.content}</Text>
            </View>
          </View>

          {/* 액션 버튼들 */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.IconButton}
              onPress={handleLikePress}>
              <Image
                source={
                  isLiked
                    ? require('@/assets/icons/post/Like_activate.png')
                    : require('@/assets/icons/post/Like.png')
                }
                style={styles.actionIcon}
              />
              <Text style={styles.actionText}>{currentLikeCount}</Text>
            </TouchableOpacity>
            <View style={styles.IconButton}>
              <Image
                source={require('@/assets/icons/post/Comment.png')}
                style={styles.actionIcon}
              />
              <Text style={styles.actionText}>
                {comment.recomments ? comment.recomments.length : 0}
              </Text>
            </View>
          </View>
        </View>

        {/* 더보기 버튼 */}
        <TouchableOpacity style={styles.moreButton}>
          <Image
            source={require('@/assets/icons/post/Info.png')}
            style={styles.moreIcon}
          />
        </TouchableOpacity>
      </View>

      {/* 대댓글 렌더링 */}
      {comment.recomments && comment.recomments.length > 0 && (
        <View>
          {comment.recomments.map((reply, index) => (
            <CommentItem
              key={`${reply.userID}-${index}`}
              comment={reply}
              isReply={true}
            />
          ))}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
    paddingBottom: 16,
  },
  replyContainer: {
    paddingLeft: 40, // 대댓글일 경우 왼쪽 여백 추가
  },
  commentContent: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 8,
    flex: 1,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    width: '100%',
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.GRAY_200,
  },
  userInfo: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 4,
    flex: 1,
  },
  nameTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  userName: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    color: colors.GRAY_600,
  },
  dot: {
    width: 2,
    height: 2,
    backgroundColor: colors.GRAY_200,
    borderRadius: 1,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    color: colors.GRAY_200,
  },
  commentText: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    color: colors.GRAY_600,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: 44,
    gap: 6,
  },
  IconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionIcon: {
    width: 24,
    height: 24,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 16,
    letterSpacing: 0.2,
    color: colors.GRAY_300,
  },
  moreButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreIcon: {
    width: 24,
    height: 24,
  },
});

export default CommentItem;
