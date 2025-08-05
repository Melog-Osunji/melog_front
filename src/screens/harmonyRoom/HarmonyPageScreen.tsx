import React, {useState} from 'react';
import {StyleSheet, Text, View, ScrollView, Image, Dimensions, FlatList, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useFocusEffect, useRoute} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {HarmonyStackParamList} from '@/navigations/stack/HarmonyStackNavigator';
import styled from 'styled-components/native';
import {colors, harmonyNavigations} from '@/constants';
import IconButton from '@/components/common/IconButton';
import {useHideTabBarOnFocus} from '@/utils/roadBottomNavigationBar';
import YouTubeEmbed2 from '@/components/common/YouTubeEmbed2';
import {HarmonyRoomDummyData} from '@/constants/types';
import ChattingBar from '@/components/harmonyRoom/ChattingBar';
import ChattingRoom from '@/components/harmonyRoom/ChattingRoom';
import ExitConfirmModal from '@/components/harmonyRoom/ExitConfirmModal';

const DEVICE_WIDTH = Dimensions.get('window').width;

type HarmonyPageScreenRouteProp = StackScreenProps<
  HarmonyStackParamList,
  'HARMONY_PAGE'
>['route'];

// 커스텀 헤더 컴포넌트
const HarmonyPageHeader = ({ title, onPressFollow }: {
                             title: string; onPressFollow: () => void; }) => {
  return (
    <View style={headerStyles.container}>
        <TouchableOpacity onPress={onPressFollow}>
            <Image
                source={require('@/assets/icons/harmonyRoom/HarmonyFollow.png')}
                style={headerStyles.icon}
            />
        </TouchableOpacity>
        <Text style={headerStyles.roomTitle}>{title}</Text>
        <IconButton
            imageSource={require('@/assets/icons/post/Info.png')}
            size={32}
        />

    </View>
  );
};

export default function HarmonyPageScreen() {
    const route = useRoute<HarmonyPageScreenRouteProp>();
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const {roomID} = route.params;
    useHideTabBarOnFocus();

    const handleAddChatt = () => {
        console.log("입력");
        };

    const harmony = HarmonyRoomDummyData.find(room => room.roomID === roomID);

    if (!harmony) {
        return (
          <SafeAreaView style={styles.container}>
            <Text>해당 하모니룸을 찾을 수 없습니다.</Text>
          </SafeAreaView>
        );
    }
    return (
        <SafeAreaView style={{flex: 1, backgroundColor:colors.GRAY_100}}>
            <HarmonyPageHeader title={harmony.title} onPressFollow={() => setModalVisible(true)} />
            <ScrollView
                style={{flex: 1}}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 100}}>
            {/*유튜브 임베딩*/}
            {harmony.mediaURL && (
              <>
                {harmony.mediaURL.includes('youtube.com') ||
                harmony.mediaURL.includes('youtu.be') ? (
                  <YouTubeEmbed2 url={harmony.mediaURL} borderRadius={0} />
                ) : (
                  <Image
                    source={{uri: harmony.mediaURL}}
                    style={styles.fullWidthImage}
                  />
                )}
              </>
            )}
            {/*플레이리스트 정보*/}
            <View style={styles.mediaInfoWrap}>
                <Text style={styles.mediaTitle}>[Playlist] 레전드 영화 속 클래식 Part.1🎬</Text>
                <View style={styles.tagAndWatch}>
                    <View style={styles.infoTagRow}>
                        <Text style={styles.tag} numberOfLines={1}>
                            {harmony.tags.map(tag => `#${tag}`).join(' ')}
                        </Text>
                    </View>
                    <View style={styles.numWrap}>
                        <Image source={require('@/assets/icons/harmonyRoom/FollowIcon.png')} style={styles.seeIcon}/>
                        <Text style={styles.seeNum}>{harmony.seeNum}</Text>
                    </View>
                </View>
            </View>
            {/*채팅창*/}
            <ChattingRoom userName="000" />
            </ScrollView>
            {/*채팅쓰기*/}
            <ChattingBar onSend={handleAddChatt}/>

            <ExitConfirmModal
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              onExit={() => { setModalVisible(false); navigation.goBack(); }}
            />
        </SafeAreaView>
        );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.WHITE,
        paddingHorizontal: 20,
        paddingVertical: 16,
        gap: 16,
    },
    mediaInfoWrap: {
        backgroundColor:colors.WHITE,
        paddingTop:12,
        paddingBottom:16,
        paddingHorizontal:20,
        flexDirection:'column',
        gap:12,
    },
    mediaTitle:{
        fontSize:15,
        fontWeight:'700',
        lineHeight:22,
        letterSpacing:0.15,
        color:colors.GRAY_600,
    },
    tagAndWatch: {
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
    },
    infoTagRow : {
        flexDirection: 'row',
        gap: 4,
    },
    tag: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.BLUE_500,
        letterSpacing:0.2,
        lineHeight:20,
    },
    seeIcon: {
        width:18,
        height:18,
    },
    numWrap : {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    seeNum: {
        fontSize: 12,
        lineHeight:16,
        color: colors.GRAY_300,
    },
});
const headerStyles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY_100,
    backgroundColor: colors.WHITE,
  },
  leftButton: {
    padding: 8,
  },
  icon: {
    width:32,
    height:32,
  },
  roomTitle: {
    fontSize: 17,
    fontWeight:'600',
    lineHeight:24,
    letterSpacing:0.1,
    color:colors.GRAY_600,
  },

});