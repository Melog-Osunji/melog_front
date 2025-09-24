import React, {useState, useEffect, useMemo} from 'react';
import {StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    Platform,
    FlatList,
    Pressable
    } from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {HarmonyStackParamList} from '@/navigations/stack/HarmonyStackNavigator';
import styled from 'styled-components/native';
import {colors, harmonyNavigations} from '@/constants';
import IconButton from '@/components/common/IconButton';
import {useHideTabBarOnFocus} from '@/utils/roadBottomNavigationBar';
import { useHarmonyRoomContext } from '@/contexts/HarmonyRoomContext';
import RoomApplyCard, { ApplyUser } from '@/components/harmonyRoom/RoomApplyCard';

const DEVICE_WIDTH = Dimensions.get('window').width;

type NavigationProp = StackNavigationProp<HarmonyStackParamList>;

type HarmonySettingRouteProp = StackScreenProps<
  HarmonyStackParamList,
  'HARMONY_APPLY'
>['route'];

const MOCK_USERS: ApplyUser[] = [
  { id: '1', name: '아이디1', intro: '자기소개하는 글입니다.' },
  { id: '2', name: '아이디2', intro: '안녕하세요 반갑습니다.' },
  { id: '3', name: '아이디3', intro: '저는 클래식을 좋아합니다.' },
];

function HarmonyApplyManageScreen(){
    useHideTabBarOnFocus();

    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<HarmonySettingRouteProp>();
    const { rooms } = useHarmonyRoomContext(); // [{id,name,tags,...}[]] 라고 가정

    const handleApprove = (id: string) => {
        console.log('승인:', id);
      };

    const handleReject = (id: string) => {
        console.log('거절:', id);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <IconButton<PostStackParamList>
                  imageSource={require('@/assets/icons/post/BackArrow.png')}
                  target={'goBack'}
                  size={24}
                />
                <Text style={styles.sectionTitle}>가입 신청 관리</Text>
            </View>
            <View style={styles.subTitle}>
                <Text style={styles.count}>가입 신청자 수 {String(MOCK_USERS.length).padStart(2,'0')}명</Text>
            </View>

             <FlatList
                data={MOCK_USERS}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <RoomApplyCard
                    user={item}
                    onApprove={handleApprove}
                    onReject={handleReject}
                  />
                )}
                contentContainerStyle={{ paddingVertical: 10, }}
              />

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.WHITE,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        height:58,
        gap: 12,
    },
    sectionTitle: {
        fontFamily: 'Noto Sans KR',
        fontSize: 17,
        lineHeight:24,
        fontWeight: '600',
        color: colors.GRAY_600,
    },
    subTitle: {
        paddingTop: 10,
        paddingHorizontal: 20,
        paddingBottom: 4,
    },
    count: {
        fontFamily: 'Noto Sans KR',
        fontSize: 12,
        lineHeight:16,
        fontWeight: '400',
        color: colors.BLACK,
        letterSpacing: 0.2,
    }
});

export default HarmonyApplyManageScreen;