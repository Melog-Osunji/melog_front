import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
  Modal,
} from 'react-native';
import {UserDTO} from '@/types';
import {colors} from '@/constants';
import IconButton from '@/components/common/IconButton';
import {showToast} from '../common/ToastService';

type Props = {
  user?: UserDTO;
  commentId?: string;
  postId: string;
  onPostDelete?: (userId: string) => void;
  onCommentDelete?: (postId: string, commentId: string) => void;
};
function PostOptionsBtn({
  user,
  commentId,
  postId,
  onPostDelete,
  onCommentDelete,
}: Props) {
  const [visible, setVisible] = useState(false);
  const handleClose = () => {
    setVisible(false);
  };
  const userId = user?.id || '';

  return (
    <>
      <IconButton
        imageSource={require('@/assets/icons/post/Info.png')}
        size={24}
        onPress={() => setVisible(true)}
      />
      {visible && (
        <TouchableOpacity
          onPress={() => {
            onPostDelete?.(userId);
            handleClose();
          }}
          activeOpacity={0.75}
          style={styles.btn}>
          <IconButton
            imageSource={require('@/assets/icons/common/trash.png')}
            size={20}
            style={{marginRight: 8}}
            onPress={() => {
              onPostDelete?.(userId);
              handleClose();
            }}
          />
          <Text style={styles.text}>삭제하기</Text>
        </TouchableOpacity>
      )}

      {visible && (
        <Modal
          transparent
          animationType="none"
          visible={visible}
          onRequestClose={handleClose}>
          <TouchableOpacity
            style={styles.overlay}
            activeOpacity={1}
            onPress={handleClose}
          />
        </Modal>
      )}
    </>
  );
}

export default PostOptionsBtn;

const styles = StyleSheet.create({
  btn: {
    position: 'absolute',
    top: 30,
    right: 5,
    display: 'flex',
    flexDirection: 'row',
    height: 44,
    paddingHorizontal: 16,
    alignItems: 'center',
    backgroundColor: colors.GRAY_50,
    borderRadius: 8,
    zIndex: 2,
    // 그림자
    shadowColor: colors.GRAY_300,
    shadowOffset: {width: 10, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  text: {
    fontSize: 14,
    color: colors.ERROR_RED,
  },
  overlay: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
});
