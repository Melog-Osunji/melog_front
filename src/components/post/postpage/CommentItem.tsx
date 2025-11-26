import React, {useState} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {colors} from '@/constants';
import type {CommentDTO} from '@/types';
import {useAuthContext} from '@/contexts/AuthContext';
import {
  useToggleCommentLike,
  useDeleteComment,
} from '@/hooks/queries/post/usePostMutations';
import PostOptionsBtn from '@/components/post/PostOptionsBtn';
import PostReportSheet from '@/components/post/PostReportSheet';
import {showToast} from '@/components/common/ToastService';
import CheckPopup from '@/components/common/CheckPopup';

type CommentItemProps = {
  comment: CommentDTO;
  isReply?: boolean;
  postId: string;
  userId?: string;
  onReply?: (target: {
    commentId?: string;
    id?: string;
    nickname: string;
  }) => void;
  onDelete?: (commentId: string) => void;
};

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  isReply = false,
  postId,
  userId,
  onReply,
  onDelete,
}) => {
  // 훅들은 항상 최상단에 위치
  const {user: authUser} = useAuthContext();
  const [isLiked, setIsLiked] = useState<boolean>(!!comment.isLiked);
  const [likeCount, setLikeCount] = useState<number>(comment.likes ?? 0);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [reportVisible, setReportVisible] = useState(false);

  const {mutate: toggleLike} = useToggleCommentLike();
  const {mutate: deleteCommentMutate, isLoading: deleting} = useDeleteComment();

  const handleToggleLike = () => {
    // optimistic UI example
    const prev = isLiked;
    setIsLiked(!prev);
    setLikeCount(c => (prev ? c - 1 : c + 1));
    toggleLike(
      {postId, commentId: comment.id},
      {
        onError: () => {
          setIsLiked(prev);
          setLikeCount(c => (prev ? c + 1 : c - 1));
          showToast('좋아요 처리에 실패했습니다.', 'error');
        },
      },
    );
  };

  const handleDelete = () => {
    setConfirmVisible(false);
    deleteCommentMutate(
      {postId, commentId: comment.id},
      {
        onSuccess: () => {
          onDelete?.(comment.id);
          showToast('댓글을 삭제했습니다.', 'success');
        },
        onError: () => showToast('댓글 삭제에 실패했습니다.', 'error'),
      },
    );
  };

  return (
    <>
      <View style={[styles.commentContainer, isReply && styles.replyContainer]}>
        <View style={styles.left}>
          <Image source={{uri: comment.profileUrl}} style={styles.avatar} />
        </View>
        <View style={styles.body}>
          <Text style={styles.nick}>{comment.nickname}</Text>
          <Text style={styles.text}>{comment.content}</Text>
        </View>

        {/* 옵션 버튼: 작성자이면 삭제 확인, 아니면 신고 시트 오픈 */}
        {authUser?.id === userId ? (
          <PostOptionsBtn onPress={() => setConfirmVisible(true)} />
        ) : (
          <PostOptionsBtn
            onPress={() => setReportVisible(true)}
            btnIcon={require('@/assets/icons/common/trash.png')}
            btnText={'신고하기'}
          />
        )}
      </View>

      <CheckPopup
        visible={confirmVisible}
        onClose={() => setConfirmVisible(false)}
        onExit={() => setConfirmVisible(false)}
        iconImg={require('@/assets/icons/common/error_red.png')}
        title={'이 댓글을 삭제할까요?'}
        leftBtnColor={colors.GRAY_50}
        rightBtnColor={colors.WHITE}
        leftBtnTextColor={colors.GRAY_500}
        rightBtnTextColor={colors.ERROR_RED}
        leftBtnText={'취소'}
        rightBtnText={'삭제'}
        rightBtnBorderColor={colors.ERROR_RED}
        onConfirm={handleDelete} // 삭제 확정 핸들러
      />

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
  commentContainer: {flexDirection: 'row', paddingVertical: 12, gap: 8},
  replyContainer: {paddingLeft: 24},
  left: {},
  avatar: {width: 36, height: 36, borderRadius: 18},
  body: {flex: 1},
  nick: {fontWeight: '700', color: colors.BLACK},
  text: {color: colors.BLACK},
});

export default CommentItem;
