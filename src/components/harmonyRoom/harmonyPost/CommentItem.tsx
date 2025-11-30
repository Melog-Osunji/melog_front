import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {colors} from '@/constants';
import type {CommentDTO} from '@/types';
import PostOptionsSheet from '@/components/harmonyRoom/harmonyPost/PostOptionsSheet';
import {useToggleHarmonyCommentLike, useDeleteHarmonyComment} from '@/hooks/queries/harmonyRoom/useHarmonyPostMutation.ts';
import PostOptionsBtn from '@/components/post/PostOptionsBtn';
import {showToast} from '@/components/common/ToastService';
import CheckPopup from '@/components/common/CheckPopup';
import PostReportSheet from '@/components/post/PostReportSheet';

interface CommentItemProps {
  comment: CommentDTO;
  isReply?: boolean;
  postId: string;
  userId?: string;
  onReply?: (target: {
    commentId?: string;
    id?: string;
    nickname: string;
  }) => void;
}

const CommentItem = ({
  comment,
  isReply = false,
  postId,
  userId,
  onReply,
}: CommentItemProps) => {
  const [isLiked, setIsLiked] = useState(comment.isLike);
  const [currentLikeCount, setCurrentLikeCount] = useState<number>(
    comment.likeCount,
  );
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [reportVisible, setReportVisible] = useState(false);

  const {mutate: toggleLike} = useToggleHarmonyCommentLike();
  const deleteCommentMutation = useDeleteHarmonyComment();

      console.log('[co]', comment.replies);


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

  const handleCommentDelete = () => {
      deleteCommentMutation.mutate(
        { postId, commentId: comment.id },
        {
        onSuccess: () => {
          console.log('[Comment] comment deleted:', comment.id);
          showToast('댓글이 삭제되었습니다.', 'success');
        },
        onError: () => {
          showToast('댓글 삭제에 실패했습니다.', 'error');
        },
      });
    };

  // 클릭하여 답글(또는 리플) 트리거
  const handleContentPress = () => {
    onReply?.({commentId: comment.id, nickname: comment.userNickname ?? 'user'});
  };

  return (
    <>
      <View style={[styles.commentContainer, isReply && styles.replyContainer]}>
        <View style={styles.commentContent}>
          {/* 프로필 섹션 */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.profileSection}
            onPress={handleContentPress}>
            <Image
              source={{uri: comment.userProfileImgLink}}
              style={styles.profileImage}
            />
            <View style={styles.userInfo}>
              <View style={styles.nameTimeRow}>
                <Text style={styles.userName}>{comment.userNickname}</Text>
                <View style={styles.dot} />
                <Text style={styles.timeText}>{comment.createdAgo}</Text>
              </View>
              <Text style={styles.commentText}>{comment.content}</Text>
            </View>
          </TouchableOpacity>

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
                {comment.replies ? comment.replies.length : 0}
              </Text>
            </View>
          </View>
        </View>

        {/* 더보기 버튼 */}
        {comment.userId === userId
            ? (<PostOptionsBtn onPress={() => setConfirmVisible(true)} />)
            : (<PostOptionsBtn onPress={() => setReportVisible(true)} btnText={'신고하기'} btnIcon={require('@/assets/icons/common/trash.png')}/> )
        }
      </View>

      {/* 대댓글 렌더링 */}
      {comment.replies && comment.replies.length > 0 && (
        <View>
          {comment.replies.map((reply, index) => (
            <CommentItem
              key={`${reply.userID}-${index}`}
              comment={reply}
              isReply={true}
              postId={postId}
              userId={userId}
              onReply={onReply}
            />
          ))}
        </View>
      )}

        {/* 삭제 확인 팝업 */}
        <CheckPopup
          visible={confirmVisible}
          onClose={() => {
              setConfirmVisible(false);
              handleCommentDelete(comment.id);
          }}
          onExit={() => {
              setConfirmVisible(false);
          }}
          iconImg={require('@/assets/icons/common/error_red.png')}
          title={'이 댓글를 삭제할까요?'}
          leftBtnColor={colors.GRAY_50}
          rightBtnColor={colors.WHITE}
          leftBtnTextColor={colors.GRAY_500}
          rightBtnTextColor={colors.ERROR_RED}
          leftBtnText={'취소'}
          rightBtnText={'삭제'}
          rightBtnBorderColor={colors.ERROR_RED}
        />

       {/* 신고 시트 */}
        <PostReportSheet
            visible={reportVisible}
            onClose={() => setReportVisible(false)}
            postId={postId}
            commentId={comment.id}
            reportedUserId={comment.userID ?? null}
            onReport={() => {
              setReportVisible(false);
              showToast('신고가 접수되었습니다.', 'success');
            }}
        />
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
