import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import BottomSheet from '@/components/common/BottomSheet';
import IconButton from '@/components/common/IconButton';
import {colors} from '@/constants';
import type {UserDTO} from '@/types';
import {useFollowUser} from '@/hooks/queries/User/useUserMutations';
import CheckPopup from '@/components/common/CheckPopup';
import {showToast} from '@/components/common/ToastService';

type Props = {
  user?: UserDTO;
  commentId?: string;
  postId: string;
  onPostDelete?: (userId: string) => void;
  onCommentDelete?: (postId: string, commentId: string) => void;
};

const PostOptionsSheet: React.FC<Props> = ({postId}) => {
  const [visible, setVisible] = useState(false);
  const handleClose = () => setVisible(false);

  return (
    <>
      <IconButton
        imageSource={require('@/assets/icons/post/Info.png')}
        size={24}
        onPress={() => setVisible(true)}
      />

      <BottomSheet visible={visible} onClose={handleClose} height="20%">
        <View style={styles.sheet}>
          <TouchableOpacity
            style={styles.row}
            onPress={() => {
              console.log('[PostOptionsSheet] report post', postId);
              handleClose();
            }}>
            <Image
              source={require('@/assets/icons/post/Abuse.png')}
              style={[styles.icon, styles.reportIcon]}
            />
            <Text style={[styles.label, styles.reportLabel]}>삭제하기</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>

      {/* popup */}
      {/* <CheckPopup
        visible={blockPopupVisible}
        onExit={() => setBlockPopupVisible(false)}
        onClose={() => {
          // confirm block
          if (!targetUserId) {
            console.warn('[PostOptionsSheet] no userId to block');
            setBlockPopupVisible(false);
            handleClose();
            showToast(`오류가 발생했어요`, 'error');
            return;
          }
          onBlock?.(targetUserId); //구현 필요
          setBlockPopupVisible(false);
          handleClose();
          showToast(`${targetNick}님을 차단했어요`, 'success');
          console.log('[PostOptionsSheet] block user', targetUserId);
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
      /> */}
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
  reportIcon: {
    tintColor: colors.RED_300,
  },
  reportLabel: {
    color: colors.RED_300,
    fontWeight: '700',
  },
});

export default PostOptionsSheet;
