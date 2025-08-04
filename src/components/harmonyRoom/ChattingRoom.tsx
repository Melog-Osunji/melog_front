import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { colors } from '@/constants';

interface Chat {
  id: string;
  sender: 'me' | 'other' | 'system';
  message: string;
  time?: string;
}

interface Props {
  userName: string;
}

export default function ChattingRoom({ userName }: Props) {
  const [chatList, setChatList] = useState<Chat[]>([]);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // 입장 시스템 메시지
    const entryMessage: Chat = {
      id: 'entry',
      sender: 'system',
      message: `${userName}님이 입장했습니다.`,
    };
    setChatList([entryMessage]);

    // 1초 뒤 상대방 메시지
    setTimeout(() => {
      setChatList(prev => [
        ...prev,
        {
          id: '아이디',
          sender: 'other',
          message: '비 오는 날 창밖 보면서 듣기 딱 좋은 곡 같아요 ☕',
          time: '오전 10:20',
        },
        {
          id: '아이디',
          sender: 'other',
          message: '안녕하세요~!',
          time: '오전 10:21',
        },
      ]);
    }, 1000);
  }, []);

  const renderItem = ({ item }: { item: Chat }) => {
    if (item.sender === 'system') {
      return (
        <View style={styles.systemMessage}>
          <Text style={styles.systemText}>{item.message}</Text>
        </View>
      );
    }

    const isMe = item.sender === 'me';

    return (
      <View style={[styles.chatBubbleWrap, isMe && styles.myChatWrap]}>
        <View style={[styles.chatBubble, isMe ? styles.myChat : styles.otherChat]}>
          <Text style={styles.chatText}>{item.message}</Text>
        </View>
        <Text style={styles.timeText}>{item.time}</Text>
      </View>
    );
  };

  return (
    <FlatList
      ref={flatListRef}
      data={chatList}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      contentContainerStyle={{ padding: 20, gap: 8 }}
      onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
    />
  );
}

const styles = StyleSheet.create({
  systemMessage: {
    alignItems: 'center',
    marginVertical: 4,
  },
  systemText: {
    fontSize: 13,
    color: colors.GRAY_300,
  },
  chatBubbleWrap: {
    alignItems: 'flex-start',
  },
  myChatWrap: {
    alignItems: 'flex-end',
  },
  chatBubble: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    maxWidth: '80%',
  },
  otherChat: {
    backgroundColor: colors.GRAY_100,
  },
  myChat: {
    backgroundColor: colors.BLUE_200,
  },
  chatText: {
    fontSize: 15,
    color: colors.BLACK,
  },
  timeText: {
    fontSize: 11,
    color: colors.GRAY_300,
    marginTop: 2,
  },
});
