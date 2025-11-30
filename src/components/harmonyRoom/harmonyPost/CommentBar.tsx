import React, {useEffect, useRef, useState, useMemo, useCallback} from 'react';
import {StyleSheet, View, TextInput, Image, Text, Pressable} from 'react-native';
import {colors} from '@/constants';
import {useCreateHarmonyComment} from '@/hooks/queries/harmonyRoom/useHarmonyPostMutation';
import {useAuthContext} from '@/contexts/AuthContext';

interface LikeAndCommentProps {
  onLikePress?: () => void;
  liked?: boolean;
  onSend?: (
      text: string,
      replyTo?: {id: string; nickname: string; commentId?: string} | null, // commentId 추가
  ) => void;
  replyTarget?: {id: string; nickname: string; commentId?: string} | null;
  postId?: string;
  onCancelReply?: () => void;
  profileUrl?: string;
}

function LikeAndComment({
  onLikePress,
  liked = false,
  onSend,
  postId,
  profileUrl,
  replyTarget,
  onCancelReply
}: LikeAndCommentProps) {
  const {user} = useAuthContext();
  const [comment, setComment] = useState('');
  const inputRef = useRef<TextInput | null>(null);

  const createCommentMutation = useCreateHarmonyComment();

  const [userText, setUserText] = useState('');
  const [selection, setSelection] = useState<{start: number; end: number}>({
    start: 0,
    end: 0,
  });
  const [overlayWidth, setOverlayWidth] = useState(0);

  const prefix = useMemo(
      () => (replyTarget ? `@${replyTarget.nickname} ` : ''),
      [replyTarget],
    );
  const visibleValue = prefix + userText;

  useEffect(() => {
    if (replyTarget) {
        inputRef.current?.focus();
    // place caret after prefix + userText
    const pos = visibleValue.length;
        setSelection({start: pos, end: pos});
    } else {
        setSelection({start: userText.length, end: userText.length});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replyTarget]);

  const handleChangeText = (fullText: string) => {
    if (replyTarget) {
      // prefix가 사라지면(사용자가 백스페이스로 지운 경우) reply 취소
      if (!fullText.startsWith(prefix)) {
        onCancelReply?.();
        // 남은 텍스트만 userText로 보관 (prefix를 제거한 것)
        const remaining = fullText.replace(/^@?[^ ]*\s?/, '');
        setUserText(remaining);
        return;
      }
      setUserText(fullText.slice(prefix.length));
    } else {
      setUserText(fullText);
    }
  };


  const handleSend = () => {
    const trimmed = userText.trim();
    if (trimmed.length === 0) return;

    onSend?.(trimmed, replyTarget || null);

   if (postId) {
     createCommentMutation.mutate({
       postId,
       content: trimmed,
       responseTo: replyTarget?.commentId ?? null, // 변경: commentId 사용
     });
   }

   setUserText('');
   onCancelReply?.();
  };

  return (
    <View style={styles.container}>
      {/* 프로필 이미지 */}
      <Image
        source={
          profileUrl
            ? {uri: profileUrl}
            : require('@/assets/icons/common/EmptyProfile.png')
        }
        style={styles.profileImage}
      />

      <View style={styles.inputWrapper}>
        <View style={styles.inputOverlayContainer}>
          <Text
            onLayout={(e: LayoutChangeEvent) =>
              setOverlayWidth(e.nativeEvent.layout.width)
            }
            style={styles.overlayText}
            numberOfLines={1}
            ellipsizeMode="tail"
            // overlay는 입력 위에 보이지만 터치/포커스는 투과시킴
            pointerEvents="none">
            {prefix ? (
              <>
                <Text style={styles.prefixText}>{prefix}</Text>
                <Text style={styles.normalText}>{userText}</Text>
              </>
            ) : (
              <Text style={styles.normalText}>{userText}</Text>
            )}
          </Text>
          <TextInput
            ref={inputRef}
            style={[styles.textInput, {paddingLeft: 12}]}
            placeholder="어떤 감상을 나누고 싶나요? "
            placeholderTextColor={colors.GRAY_500}
            value={visibleValue}
            onChangeText={handleChangeText}
            returnKeyType="send"
            onSubmitEditing={handleSend}
            multiline={false}
            selection={selection}
            onSelectionChange={({nativeEvent}) =>
              setSelection(nativeEvent.selection)
            }
            caretColor={colors.BLUE_400}
            textContentType="none"
            secureTextEntry={false}
          />
        </View>
      </View>

      {userText.length > 0 ? (
      <Pressable
        style={styles.sendbtn}
        onPress={handleSend}
        android_ripple={{color: 'rgba(0,0,0,0.1)'}}
        pressRetentionOffset={30}
        hitSlop={10}>
        {({pressed}) => (
          <Image
            source={require('@/assets/icons/post/sendbtn.png')}
            style={[styles.sendbtn, {opacity: pressed ? 0.5 : 1}]}
            resizeMode="contain"
          />
        )}
      </Pressable>
    ) : null}
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
    backgroundColor: colors.WHITE,
    borderTopWidth: 1,
    borderTopColor: '#ECECEC',
    gap: 12,
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.GRAY_200,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputOverlayContainer: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
  },
  // overlayText renders formatted text (visible) and should not block touches
  overlayText: {
    position: 'absolute',
    left: 12,
    right: 12,
    zIndex: 3,
    includeFontPadding: false,
    // ensure same font metrics as TextInput
    fontSize: 14,
    lineHeight: 20,
  },
  prefixText: {
    color: colors.BLUE_400,
    fontWeight: '600',
  },
  normalText: {
    color: colors.BLACK,
  },
  // TextInput placed on top; set color to transparent but caretColor visible
  textInput: {
    flex: 1,
    fontSize: 14,
    color: 'transparent', // hide raw input text (overlay shows formatted text)
    paddingRight: 12,
    paddingVertical: 8,
    margin: 0,
    textAlignVertical: 'center',
    backgroundColor: colors.GRAY_100,
    borderRadius: 8,
    zIndex: 2,
    // ensure same metrics as overlay
    lineHeight: 20,
  },
  sendbtn: {
    width: 24,
    height: 24,
  },
  cancelBtn: {
    marginLeft: 6,
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
  }
});

export default LikeAndComment;
