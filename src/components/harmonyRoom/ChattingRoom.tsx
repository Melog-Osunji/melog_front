import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import { colors } from '@/constants';

interface Chat {
  id: string;
  sender: 'me' | 'other' | 'system';
  message: string;
  time?: string;
  nickname?: string;
}

interface Props {
  userName: string;
}

export default function ChattingRoom({ userName }: Props) {
  const [chatList, setChatList] = useState<Chat[]>([]);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const entryMessage: Chat = {
      id: 'entry',
      sender: 'system',
      message: `${userName}님이 입장했습니다.`,
    };

    const message1: Chat = {
      id: 'user001',
      sender: 'other',
      nickname: '아이디',
      message: '비 오는 날 창밖 보면서 듣기 딱 좋은 곡 같아요 ☕',
      time: '오전 10:20',
    };

    const message2: Chat = {
      id: 'user002',
      sender: 'other',
      nickname: '아이디',
      message: '안녕하세요~!',
      time: '오전 10:21',
    };

    // 입장 메시지 먼저
    setChatList([entryMessage]);

    // 1초 뒤 첫 메시지
    setTimeout(() => {
      setChatList(prev => [...prev, message1]);
    }, 1000);

    // 2초 뒤 두 번째 메시지
    setTimeout(() => {
      setChatList(prev => [...prev, message2]);
    }, 2000);
  }, []);


  const renderItem = ({ item, index }: { item: Chat; index: number }) => {
    if (item.sender === 'system') {
      return (
        <View style={styles.systemMessage}>
          <Text style={styles.systemText}>{item.message}</Text>
        </View>
      );
    }

    const isMe = item.sender === 'me';

    // 이전 채팅과 동일한 발신자?
    const isSameSender =
      index > 0 && chatList[index - 1].sender === item.sender && chatList[index - 1].nickname === item.nickname;

    return (
      <View style={[styles.chatRow, isMe && styles.myRow]}>
        {!isMe && (
          <View style={styles.avatarWrapper}>
            {!isSameSender ? (
              <View style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder} />
            )}
          </View>
        )}

        <View style={{ flex: 1 }}>
          {!isMe && !isSameSender && item.nickname && (
            <Text style={styles.nickname}>{item.nickname}</Text>
          )}
          <View style={styles.chatAndTime}>
            <View style={[styles.chatBubble, isMe ? styles.myChat : styles.otherChat]}>
              <Text style={styles.chatText}>{item.message}</Text>
            </View>
            <Text style={styles.timeText}>{item.time}</Text>
          </View>
        </View>
      </View>
    );
  };


  return (
    <View style={{ flex: 1 }}>
      {/* 공지 영역 */}
      <View style={styles.noticeBar}>
        <Image source={require('@/assets/icons/harmonyRoom/HarmonyNotice.png')} style={styles.icon}/>
        <Text style={styles.noticeText}>채팅방 규칙을 써놓은 공지입니다. 말은 부드…</Text>
        <Image source={require('@/assets/icons/post/DownArrow.png')} style={[styles.icon, { tintColor: colors.GRAY_100 }]}/>
      </View>

      <View style={{ paddingHorizontal: 20, gap: 4 }}>
        {chatList.map((item, index) => (
          <View key={`${item.id}-${index}`}>{renderItem({ item, index })}</View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    noticeBar: {
        margin: 20,
        backgroundColor: '#2B2B2B80',
        padding:8,
        flexDirection:'row',
        borderRadius:8,
        justifyContent:'space-between',
        alignItems:'center',
    },
    icon: {
        width:24,
        height:24,
    },
    noticeText: {
        color: colors.GRAY_100,
        fontSize: 14,
        fontWeight: '500',
        lineHeight:20,
    },
    systemMessage: {
        alignSelf: 'center',
        alignItems: 'center',
        paddingHorizontal:12,
        paddingVertical:8,
        borderRadius:40,
        backgroundColor:'#A5ADDC3B',
        marginBottom:20,
    },
    systemText: {
        fontSize: 11,
        lineHeight:14,
        fontWeight:'400',
        color: colors.GRAY_600,
    },
    chatRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
    },
    myRow: {
        flexDirection: 'row-reverse',
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 50,
        backgroundColor: colors.GRAY_500,
    },
    nickname: {
        fontSize: 14,
        lineHeight:20,
        color: colors.GRAY_400,
        marginBottom: 2,
    },
    chatAndTime:{
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'flex-end',
        gap:4,
    },
    chatBubble: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        maxWidth: '80%',
    },
    otherChat: {
        backgroundColor:colors.WHITE,
    },
    myChat: {
        backgroundColor: colors.BLUE_400,
    },
    chatText: {
        fontSize: 14,
        lineHeight:20,
        color: colors.GRAY_600,
    },
    timeText: {
        fontSize: 11,
        lineHeight:14,
        letterSpacing: 0.35,
        color: colors.GRAY_300,
        marginTop: 2,
    },
    avatarWrapper: {
        width: 36,
        alignItems: 'center',
    },
    avatarPlaceholder: {
        width: 36,
        height: 36,
    },
});
