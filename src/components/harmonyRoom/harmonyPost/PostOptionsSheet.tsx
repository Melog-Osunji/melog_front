import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import BottomSheet from '@/components/common/BottomSheet';
import IconButton from '@/components/common/IconButton';
import {colors} from '@/constants';
import type {UserDTO} from '@/types';
import CheckPopup from '@/components/common/CheckPopup';
import {useFollowUser} from '@/hooks/queries/User/useUserMutations';

type Props = {
  user?: UserDTO;
  userId?: string;
  postId: string;
  // optional callbacks
  onFollow?: (userId: string) => void;
  onFollow?: (userId: string) => void;
  onHideFeed?: (postId: string) => void;
  onBlock?: (userId: string) => void;
  onReport?: (postId: string) => void;
};

const PostOptionsSheet: React.FC<Props> = ({
  user,
  userId,
  postId,
  onFollow,
  onHideFeed,
  onBlock,
  onReport,
}) => {
  const [visible, setVisible] = useState(false);
  const [blockPopupVisible, setBlockPopupVisible] = useState(false);

  const {mutate: followUser, isLoading: isFollowingLoading} = useFollowUser();

  const handleClose = () => setVisible(false);

  // user가 있으면 그 id를 우선 사용, 없으면 props로 들어온 userId 사용
  const targetUserId = user?.id ?? userId;
  const targetNick = user?.nickName ?? '';

  return (
    <>
      <IconButton
        imageSource={require('@/assets/icons/post/Info.png')}
        size={24}
        onPress={() => setVisible(true)}
      />

      <BottomSheet visible={visible} onClose={handleClose} height="40%">
        <View style={styles.sheet}>
          <TouchableOpacity
            style={styles.row}
            onPress={() => {
              if (!targetUserId) {
                console.warn('[PostOptionsSheet] no userId to follow');
                return;
              }
              console.log('[PostOptionsSheet] follow user', targetUserId);
              // 서버 API 스펙에 맞춰 follower 필드에 대상 유저 id 전송
              //               followUser(targetUserId, {
              //                 onSuccess: _data => {
              //                   onFollow?.(targetUserId);
              //                   handleClose();
              //                 },
              //                 onError: err => {
              //                   console.error('[PostOptionsSheet] follow error:', err);
              //                 },
              //               });
            }}
            //             disabled={isFollowingLoading}
          >
            <Image
              source={require('@/assets/icons/post/Follow.png')}
              style={styles.icon}
            />
            <Text style={styles.label}>{targetNick}님 팔로우하기</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.row}
            onPress={() => {
              console.log('[PostOptionsSheet] hide feed', postId);
              onHideFeed?.(postId);
              handleClose();
            }}>
            <Image
              source={require('@/assets/icons/post/Hide.png')}
              style={styles.icon}
            />
            <Text style={styles.label}>이 피드 숨기기</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.row}
            onPress={() => {
              // show confirmation popup before blocking
              setBlockPopupVisible(true);
            }}>
            <Image
              source={require('@/assets/icons/post/Block.png')}
              style={styles.icon}
            />
            <Text style={styles.label}>{targetNick}님 차단하기</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.row, styles.reportRow]}
            onPress={() => {
              console.log(
                '[PostOptionsSheet] report post',
                postId,
                'user:',
                targetUserId,
              );
              onReport?.(postId);
              handleClose();
            }}>
            <Image
              source={require('@/assets/icons/post/Abuse.png')}
              style={[styles.icon, styles.reportIcon]}
            />
            <Text style={[styles.label, styles.reportLabel]}>신고하기</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>

      {/* popup */}
      <CheckPopup
        visible={blockPopupVisible}
        onClose={() => setBlockPopupVisible(false)}
        onExit={() => {
          // confirm block
          if (!targetUserId) {
            console.warn('[PostOptionsSheet] no userId to block');
            setBlockPopupVisible(false);
            handleClose();
            return;
          }
          onBlock?.(targetUserId);
          setBlockPopupVisible(false);
          handleClose(); // close bottom sheet as well
        }}
        iconImg={require('@/assets/icons/common/error_red.png')}
        title={`${targetNick}님을 차단하시겠어요?`}
        content="차단한 상대방의 피드를 볼 수 없게 돼요."
        leftBtnColor={colors.GRAY_100}
        rightBtnColor={colors.WHITE}
        leftBtnTextColor={colors.GRAY_300}
        rightBtnTextColor={colors.RED_300}
        leftBtnText="취소"
        rightBtnText="차단하기"
        rightBtnBorderColor={colors.RED_300}
      />
    </>
  );
};

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
  reportRow: {
    marginTop: 8,
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
