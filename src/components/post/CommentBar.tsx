import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import {colors} from '@/constants';

interface LikeAndCommentProps {
  onLikePress?: () => void;
  liked?: boolean;
  onSend?: (text: string) => void;
}

function LikeAndComment({
  onLikePress,
  liked = false,
  onSend,
}: LikeAndCommentProps) {
  const [comment, setComment] = useState('');

  const handleSend = () => {
    if (onSend && comment.trim()) {
      onSend(comment.trim());
      setComment('');
    }
  };

  return (
    <View style={styles.container}>
      {/* 프로필 이미지 */}
      <View style={styles.profileImage} />

      {/* 댓글 입력 영역 */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="어떤 감상을 나누고 싶나요? "
          placeholderTextColor={colors.GRAY_500}
          value={comment}
          onChangeText={setComment}
          returnKeyType="send"
          onSubmitEditing={handleSend}
          multiline={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: '100%',
    height: 60,
    backgroundColor: colors.WHITE,
    borderTopWidth: 1,
    borderTopColor: '#ECECEC',
    gap: 10,
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.GRAY_200,
  },
  inputContainer: {
    flex: 1,
    height: 36,
    backgroundColor: colors.GRAY_100,
    borderRadius: 8,
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: colors.BLACK,
    paddingHorizontal: 12,
    paddingVertical: 0,
    margin: 0,
    textAlignVertical: 'center',
  },
  placeholder: {
    fontSize: 14,
    color: colors.GRAY_500,
  },
});

export default LikeAndComment;
