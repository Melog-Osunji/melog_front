import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {colors} from '@/constants';
import type {CommentDTO} from '@/types';
import {useAuthContext} from '@/contexts/AuthContext';
import {useToggleCommentLike} from '@/hooks/queries/post/usePostMutations';
import PostOptionsSheet from '@/components/post/PostOptionsSheet';
import PostOptionsBtn from '../PostOptionsBtn';

interface CommentItemProps {
  comment: CommentDTO;
  isReply?: boolean;
  postId: string;
  userId?: string;
}

const CommentItem = ({
  comment,
  isReply = false,
  postId,
  userId,
}: CommentItemProps) => {
  const {user: authUser} = useAuthContext();

  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [currentLikeCount, setCurrentLikeCount] = useState<number>(
    comment.likes,
  );

  const {mutate: toggleLike} = useToggleCommentLike();

  const handleLikePress = () => {
    // 이전 상태 보관 (롤백용)
    const prevLiked = isLiked;
    const prevCount = currentLikeCount;

    // 낙관적 업데이트
    const newLiked = !isLiked;
    const newCount = newLiked
      ? currentLikeCount + 1
      : Math.max(0, currentLikeCount - 1);
    setIsLiked(newLiked);
    setCurrentLikeCount(newCount);

    toggleLike(
      {postId, commentId: comment.id},
      {
        onSuccess: data => {
          console.log(
            '[CommentItem.tsx] useToggleCommentLike onSuccess:',
            comment.id,
            data,
          );

          // 서버가 liked/likeCount를 반환하면 그 값으로 동기화
          if (data && typeof data.liked !== 'undefined') {
            setIsLiked(Boolean(data.liked));
            setCurrentLikeCount(Number(data.likeCount ?? newCount));
          }
        },
        onError: error => {
          console.error(
            '[CommentItem.tsx] useToggleCommentLike onError:',
            comment.id,
            error,
          );
          // 롤백
          setIsLiked(prevLiked);
          setCurrentLikeCount(prevCount);
        },
      },
    );
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
                <Text style={styles.userName}>
                  {comment.nickname ? comment.nickname : 'user'}
                </Text>
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
                    : require('@/assets/icons/post/Like-2.png')
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
        {/* {authUser?.id === userId ? (
          <PostOptionsBtn />
        ) : (
          <PostOptionsSheet postId={postId} />
        )} */}
        <PostOptionsSheet postId={postId} />
      </View>

      {/* 대댓글 렌더링 */}
      {comment.recomments && comment.recomments.length > 0 && (
        <View>
          {comment.recomments.map((reply, index) => (
            <CommentItem
              key={`${reply.userID}-${index}`}
              comment={reply}
              isReply={true}
              postId={postId}
              userId={reply.userID}
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
