import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';

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
      <TouchableOpacity onPress={onLikePress} style={styles.iconBtn}>
        <Text style={[styles.emoji, liked && styles.liked]}>
          {liked ? '❤️' : '🤍'}
        </Text>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="댓글을 입력하세요"
        value={comment}
        onChangeText={setComment}
        returnKeyType="send"
        onSubmitEditing={handleSend}
      />
      <TouchableOpacity onPress={handleSend} style={styles.iconBtn}>
        <Text style={styles.emoji}>📤</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 80,
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconBtn: {
    padding: 6,
  },
  emoji: {
    fontSize: 24,
  },
  liked: {
    textShadowColor: '#e74c3c',
    textShadowRadius: 4,
  },
  input: {
    flex: 1,
    marginHorizontal: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    fontSize: 16,
  },
});

export default LikeAndComment;
