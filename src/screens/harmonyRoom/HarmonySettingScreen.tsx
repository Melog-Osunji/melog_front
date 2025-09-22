import React, {useState, useEffect} from 'react';
import {StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    Dimensions,
    Platform,
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
import SwitchToggle from '@/components/common/SwitchToggle';


const DEVICE_WIDTH = Dimensions.get('window').width;
type NavigationProp = StackNavigationProp<HarmonyStackParamList>;

type HarmonySettingRouteProp = StackScreenProps<
  HarmonyStackParamList,
  'HARMONY_SETTING'
>['route'];

function HarmonySettingScreen(){
    useHideTabBarOnFocus();

    const navigation = useNavigation<StackNavigationProp<HarmonyStackParamList>>();

    const route = useRoute<HarmonySettingRouteProp>();
    const { roomID } = route.params ?? {};
    const { rooms } = useHarmonyRoomContext();

    const [isPublic, setIsPublic] = useState(true);
    const [needApproval, setNeedApproval] = useState(false);

    const handleGoToEdit = () => {
        navigation.navigate(harmonyNavigations.HARMONY_EDIT, { roomID: roomID});
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <IconButton<PostStackParamList>
                      imageSource={require('@/assets/icons/post/BackArrow.png')}
                      target={'goBack'}
                      size={24}
                    />
                    <Text style={styles.sectionTitle}>하모니룸 설정</Text>
                </View>
                <View style={styles.menuSection}>
                    <Text style={styles.topMenu}>내 하모니룸</Text>
                </View>
                <Pressable style={styles.section} onPress={handleGoToEdit}>
                    <Text style={styles.menu}>하모니룸 정보</Text>
                    <Image source={require('@/assets/icons/mypage/RightArrow.png')} style={styles.iconBtn}/>
                </Pressable>
                <View style={styles.toggleSection}>
                    <View style={styles.toggleWrap}>
                        <Text style={styles.menu}>하모니룸 공개</Text>
                        <SwitchToggle
                          value={isPublic}
                          onValueChange={setIsPublic}
                          size="md"
                        />
                    </View>
                    <Text style={styles.description}>하모니룸을 유저들에게 공개할 수 있어요.</Text>
                </View>
                <View style={styles.blank}></View>
                <View style={styles.menuSection}>
                    <Text style={styles.topMenu}>하모니룸 관리</Text>
                </View>
                <View style={styles.toggleSection}>
                    <View style={styles.toggleWrap}>
                        <Text style={styles.menu}>운영자 승인 후 가입</Text>
                        <SwitchToggle
                          value={needApproval}
                          onValueChange={setNeedApproval}
                          size="md"
                        />
                    </View>
                    <Text style={styles.description}>운영자가 승인해야 하모니룸에 가입할 수 있어요.</Text>
                </View>
                <Pressable style={styles.section}>
                    <Text style={styles.menu}>가입 신청 관리</Text>
                    <View style={styles.accessWrap}>
                        <Text style={styles.accessNum}>+00</Text>
                        <Image source={require('@/assets/icons/mypage/RightArrow.png')} style={styles.iconBtn}/>
                    </View>
                </Pressable>
                <Pressable style={styles.section}>
                    <Text style={styles.menu}>회원 관리</Text>
                    <Image source={require('@/assets/icons/mypage/RightArrow.png')} style={styles.iconBtn}/>
                </Pressable>
                <Pressable style={styles.section}>
                    <Text style={styles.menu}>차단 관리</Text>
                    <Image source={require('@/assets/icons/mypage/RightArrow.png')} style={styles.iconBtn}/>
                </Pressable>
                <View style={styles.blank}></View>
                <View style={styles.menuSection}>
                    <Text style={styles.topMenu}>기타</Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.menu}>하모니룸 폐쇄</Text>
                    <Pressable>
                    <Text style={styles.delete}>폐쇄하기</Text>
                    </Pressable>
                </View>
            </ScrollView>
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
        fontSize: 17,
        lineHeight:24,
        fontWeight: '600',
        color: colors.GRAY_600,
    },
    blank: {
        height: 40,
    },
    menuSection: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 4,
    },
    topMenu: {
        fontFamily: 'Noto Sans KR',
        fontSize: 12,
        fontWeight: '400',
        letterSpacing: 0.2,
        lineHeight: 16,
        color: colors.BLACK,
    },
    section: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    toggleSection: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        flexDirection: 'column',
        gap: 10,
    },
    menu: {
        fontFamily: 'Noto Sans KR',
        fontSize: 14,
        fontWeight: '500',
        letterSpacing: 0.2,
        lineHeight: 20,
        color: colors.BLACK,
    },
    description: {
        fontFamily: 'Noto Sans KR',
        fontSize: 12,
        fontWeight: '400',
        letterSpacing: 0.2,
        lineHeight: 16,
        color: colors.GRAY_400,
    },
    toggleWrap: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    accessWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    accessNum: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 999,
        backgroundColor: colors.BLUE_200,
        fontFamily: 'Noto Sans KR',
        fontSize: 12,
        fontWeight: '400',
        letterSpacing: 0.2,
        lineHeight: 16,
        color: colors.BLUE_500,
    },
    delete: {
        fontFamily: 'Noto Sans KR',
        fontSize: 14,
        fontWeight: '400',
        letterSpacing: 0.2,
        lineHeight: 20,
        color: colors.RED_300,
    },
});

export default HarmonySettingScreen;