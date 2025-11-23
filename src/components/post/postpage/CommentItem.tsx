import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {colors} from '@/constants';
import type {CommentDTO} from '@/types';
import {useAuthContext} from '@/contexts/AuthContext';
//hooks
import {useToggleCommentLike} from '@/hooks/queries/post/usePostMutations';
import {useDeleteComment} from '@/hooks/queries/post/usePostMutations';
//components
import PostOptionsBtn from '@//components/post/PostOptionsBtn';
import {showToast} from '@/components/common/ToastService';
import CheckPopup from '@/components/common/CheckPopup';

interface CommentItemProps {
  comment: CommentDTO;
  isReply?: boolean;
  postId: string;
  userId?: string;
  onReply?: (target: {commentId: string; nickname: string}) => void;
  onDelete?: (commentId: string) => void;
}

const CommentItem = ({
  comment,
  isReply = false,
  postId,
  userId,
  onReply,
  onDelete,
}: CommentItemProps) => {
  const {user: authUser} = useAuthContext();

  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [currentLikeCount, setCurrentLikeCount] = useState<number>(
    comment.likes,
  );
  const [confirmVisible, setConfirmVisible] = useState(false); // added

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

  const deleteCommentMutation = useDeleteComment();

  const handleDeleteComment = () => {
    deleteCommentMutation.mutate(
      {postId: postId, commentId: comment.id},
      {
        onSuccess: () => {
          showToast('댓글이 삭제되었습니다.', 'success');
        },
        onError: () => {
          showToast('댓글 삭제에 실패했습니다.', 'error');
        },
      },
    );
  };

  // commentContent 클릭 시 호출
  const handleContentPress = () => {
    onReply?.({commentId: comment.id, nickname: comment.nickname ?? 'user'}); // changed
  };

  return (
    <>
      <View style={[styles.commentContainer, isReply && styles.replyContainer]}>
        <View style={styles.commentWrapper}>
          <Image
            source={{uri: comment.profileUrl}}
            style={styles.profileImage}
          />

          {/* 변경: commentContent을 TouchableOpacity로 감싸서 전체 영역 클릭 처리 */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleContentPress}
            style={styles.commentContent}>
            {/* commentInfo */}
            <View style={styles.commentInfo}>
              <Text style={styles.userName}>
                {comment.nickname ? comment.nickname : 'user'}
              </Text>
              <View style={styles.dot} />
              <Text style={styles.timeText}>방금 전</Text>
            </View>

            {/* comment.content */}
            <Text style={styles.commentText}>{comment.content}</Text>

            {/* actionButtons */}
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
          </TouchableOpacity>
        </View>

        {authUser?.id === userId ? (
          // open confirmation popup first
          <PostOptionsBtn onPress={() => setConfirmVisible(true)} />
        ) : (
          <PostOptionsBtn
            onPress={() => {
              showToast('신고 되었습니다(임시)', 'success');
            }}
            btnIcon={require('@/assets/icons/common/trash.png')}
            btnText={'신고하기'}
          />
        )}
      </View>

      {/* 삭제 확인 팝업 */}
      <CheckPopup
        visible={confirmVisible}
        onClose={() => {
          setConfirmVisible(false);
          handleDeleteComment();
        }}
        onExit={() => {
          setConfirmVisible(false);
        }}
        iconImg={require('@/assets/icons/common/error_red.png')}
        title={'이 댓글을 삭제할까요?'}
        leftBtnColor={colors.GRAY_50}
        rightBtnColor={colors.WHITE}
        leftBtnTextColor={colors.GRAY_500}
        rightBtnTextColor={colors.ERROR_RED}
        leftBtnText={'취소'}
        rightBtnText={'삭제'}
        rightBtnBorderColor={colors.ERROR_RED}
      />
      {/* 대댓글 렌더링: onReply 전달 */}
      {comment.recomments && comment.recomments.length > 0 && (
        <View>
          {comment.recomments.map((reply, index) => (
            <CommentItem
              key={`${reply.userID}-${index}`}
              comment={reply}
              isReply={true}
              postId={postId}
              userId={reply.userID}
              onReply={onReply}
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
  commentWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    flex: 1,
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.GRAY_200,
  },
  commentContent: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 4,
    flex: 1,
  },
  commentInfo: {
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
    marginTop: 8,
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
