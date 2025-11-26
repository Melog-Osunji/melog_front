import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import BottomSheet from '@/components/common/BottomSheet';
import IconButton from '@/components/common/IconButton';
import {colors} from '@/constants';
import type {UserDTO} from '@/types';
import {useFollowUser} from '@/hooks/queries/User/useUserMutations';
import {useHidePost} from '@/hooks/queries/post/usePostMutations'; // added
import CheckPopup from '@/components/common/CheckPopup';
import {showToast} from '@/components/common/ToastService';
import PostReportSheet from '@/components/post/PostReportSheet'; // 추가
import {useBlockUser} from '@/hooks/queries/User/useUserMutations'; // 추가

type Props = {
  user?: UserDTO;
  userId?: string;
  postId: string;
  // optional callbacks
  onFollow?: (userId: string) => void;
  onHide?: (postId: string) => void;
  onBlock?: (userId: string) => void;
  onReport?: (postId: string) => void;
};

function PostOptionsSheet({
  user,
  userId,
  postId,
  onFollow,
  onHide,
  onBlock,
  onBlock: onBlockProp, // keep existing prop
  onReport,
}: Props) {
  const targetUserId = user?.id ?? userId;
  const targetNick = user?.nickName ?? '';

  const [visible, setVisible] = useState(false);
  const [blockPopupVisible, setBlockPopupVisible] = useState(false);
  const [reportVisible, setReportVisible] = useState(false);
  const {mutate: followUser, isLoading: isFollowingLoading} = useFollowUser();

  // hide mutation
  const {mutate: hidePostMutate, isLoading: isHiding} = useHidePost();

  // block mutation
  const {mutate: blockUserMutate, isLoading: isBlocking} = useBlockUser();

  const handleClose = () => setVisible(false);

  return (
    <>
      <IconButton
        imageSource={require('@/assets/icons/post/Info.png')}
        size={24}
        onPress={() => setVisible(true)}
      />

      <BottomSheet visible={visible} onClose={handleClose} height="40%">
        <View style={styles.sheet}>
          {/* follow button (unchanged) */}
          <TouchableOpacity
            style={styles.row}
            onPress={() => {
              if (!targetUserId) {
                console.warn('[PostOptionsSheet] no userId to follow');
                return;
              }
              followUser(targetUserId, {
                onSuccess: _data => {
                  onFollow?.(targetUserId);
                  handleClose();
                },
                onError: err => {
                  console.error('[PostOptionsSheet] follow error:', err);
                },
              });
            }}
            disabled={isFollowingLoading}>
            <Image
              source={require('@/assets/icons/post/Follow.png')}
              style={styles.icon}
            />
            <Text style={styles.label}>{targetNick}님 팔로우하기</Text>
          </TouchableOpacity>

          {/* hide post -> call hide API then parent callback on success */}
          <TouchableOpacity
            style={styles.row}
            onPress={() => {
              hidePostMutate(postId, {
                onSuccess: () => {
                  console.log('[PostOptionsSheet] post hidden:', postId);
                  onHide?.(postId);
                  handleClose();
                  showToast('해당 피드를 숨겼습니다.', 'success');
                },
                onError: err => {
                  console.error('[PostOptionsSheet] hide post error:', err);
                  showToast('피드 숨기기에 실패했습니다.', 'error');
                },
              });
            }}
            disabled={isHiding}>
            <Image
              source={require('@/assets/icons/post/Hide.png')}
              style={styles.icon}
            />
            <Text style={styles.label}>이 피드 숨기기</Text>
          </TouchableOpacity>

          {/* block row */}
          <TouchableOpacity
            style={styles.row}
            onPress={() => {
              setBlockPopupVisible(true);
            }}>
            <Image
              source={require('@/assets/icons/post/Block.png')}
              style={styles.icon}
            />
            <Text style={styles.label}>{targetNick}님 차단하기</Text>
          </TouchableOpacity>

          {/* report row unchanged */}
          <TouchableOpacity
            style={styles.row}
            onPress={() => {
              handleClose();
              setTimeout(() => setReportVisible(true), 80);
            }}>
            <Image
              source={require('@/assets/icons/post/Abuse.png')}
              style={[styles.icon, styles.reportIcon]}
            />
            <Text style={[styles.label, styles.reportLabel]}>신고하기</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>

      {/* block confirmation popup: call mutation and on success call parent callback */}
      <CheckPopup
        visible={blockPopupVisible}
        onExit={() => setBlockPopupVisible(false)}
        onClose={() => {
          if (!targetUserId) {
            console.warn('[PostOptionsSheet] no userId to block');
            setBlockPopupVisible(false);
            handleClose();
            showToast(`오류가 발생했어요`, 'error');
            return;
          }

          blockUserMutate(targetUserId, {
            onSuccess: () => {
              // notify parent and close sheets
              onBlock?.(targetUserId);
              setBlockPopupVisible(false);
              handleClose();
              showToast(`${targetNick}님을 차단했습니다`, 'success');
            },
            onError: err => {
              console.error('[PostOptionsSheet] block user error:', err);
              setBlockPopupVisible(false);
              showToast('차단 처리에 실패했습니다.', 'error');
            },
          });
        }}
        iconImg={require('@/assets/icons/common/error_red.png')}
        title={`${targetNick}님을 차단할까요?`}
        content="차단한 상대방의 피드를 볼 수 없게 돼요."
        leftBtnColor={colors.GRAY_100}
        rightBtnColor={colors.WHITE}
        leftBtnTextColor={colors.GRAY_300}
        rightBtnTextColor={colors.RED_300}
        leftBtnText="취소"
        rightBtnText="차단하기"
        rightBtnBorderColor={colors.RED_300}
      />

      {/* report sheet unchanged */}
      <PostReportSheet
        visible={reportVisible}
        onClose={() => setReportVisible(false)}
        postId={postId}
        onReport={(reason: string) => {
          setReportVisible(false);
          onReport?.(postId);
          showToast('신고가 접수되었습니다.', 'success');
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  sheet: {
    paddingVertical: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  icon: {
    width: 28,
    height: 28,
    marginRight: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.BLACK,
  },
  reportIcon: {
    tintColor: colors.RED_300,
  },
  reportLabel: {
    color: colors.RED_300,
    fontWeight: '700',
  },
});

export default PostOptionsSheet;
