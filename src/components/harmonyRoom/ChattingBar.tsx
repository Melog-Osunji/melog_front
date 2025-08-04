import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  Keyboard,
} from 'react-native';
import {colors} from '@/constants';

interface ChattingProps{
    onSend?: (text:string) => void;
}

function ChattingBar({
    onSend,
    }:ChattingProps) {
    const [chat, setChat] = useState('');
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

    const handleSend = () => {
        if (onSend && chat.trim()) {
              onSend(chat.trim());
              setChat('');
            }
    }

    useEffect(() => {
        const showSub = Keyboard.addListener('keyboardDidShow', () =>
          setIsKeyboardVisible(true)
        );
        const hideSub = Keyboard.addListener('keyboardDidHide', () =>
          setIsKeyboardVisible(false)
        );
        return () => {
          showSub.remove();
          hideSub.remove();
        };
      }, []);

    return (
        <View style={styles.container}>
            {/* 댓글 입력 영역 */}
            <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder={isKeyboardVisible ? '어떤 감상이 드나요?' : '어떤 감상을 나누고 싶나요?'}
              placeholderTextColor={colors.GRAY_500}
              value={chat}
              onChangeText={setChat}
              returnKeyType="send"
              onSubmitEditing={handleSend}
              multiline={false}
            />
            </View>
            {isKeyboardVisible && (
                  <TouchableOpacity onPress={handleSend} >
                        <Image
                          source={require('@/assets/icons/harmonyRoom/Send.png')}
                          style={styles.sendIcon}
                        />
                  </TouchableOpacity>
            )}
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
  sendIcon: {
    width:28,
    height:28,
  }
});

export default ChattingBar;
