import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, Text, View, ScrollView, Image, Dimensions, FlatList, TouchableOpacity, Keyboard, Pressable} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useFocusEffect, useRoute} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {HarmonyStackParamList} from '@/navigations/stack/HarmonyStackNavigator';
import {colors, harmonyNavigations, postNavigations} from '@/constants';
import IconButton from '@/components/common/IconButton';
import {HarmonyRoomDummyData} from '@/constants/types';
import ExitConfirmModal from '@/components/harmonyRoom/ExitConfirmModal';
import { useHarmonyRoomContext } from '@/contexts/HarmonyRoomContext';
import GuideModal from '@/components/harmonyRoom/GuideModal';
import LinearGradient from 'react-native-linear-gradient';
import EmptyTab from '@/components/search/EmptyTab'
import {useHideTabBarOnFocus} from '@/utils/roadBottomNavigationBar';
import CustomButton from '@/components/common/CustomButton';
import CheckPopupOneBtn from '@/components/common/CheckPopupOneBtn';
import CheckPopup from '@/components/common/CheckPopup';

const {width: SCREEN_W} = Dimensions.get('window');

type HarmonyPageScreenRouteProp = StackScreenProps<
  HarmonyStackParamList,
  'HARMONY_PAGE'
>['route'];

export default function HarmonyInfoScreen() {
    useHideTabBarOnFocus();


    const route = useRoute<HarmonyPageScreenRouteProp>();
    const {roomID, roomData} = route.params;
    const { rooms } = useHarmonyRoomContext();
    const [selectTab, setSelectTab] = useState<'rcmd' | 'popular'>('rcmd');

    const harmony = roomData ?? rooms.find(r => r.roomID === roomID);

    const [isOwner, setIsOwner] = useState(false);
    const [isMember, setIsMember] = useState(true);

    const [showExitPopup, setShowExitPopup] = useState(false);
    const [showOutPopup, setShowOutPopup] = useState(false);


    // 가입 모달 오픈
    const handleAccess = () => {
        setShowExitPopup(true);
    };

    // 확인
    const handleConfirmExit = () => {
      setShowExitPopup(false);
    };

    // 나가기 모달 오픈
    const handleOut = () => {
        setShowOutPopup(true);
    };

    // 머무르기
    const handleCancelExit = () => {
        setShowOutPopup(false);
    };

    // 나가기
    const handleOutAccess = () => {
        setShowOutPopup(false);
    }


    return (
        <LinearGradient
          colors={['#EFFAFF', colors.WHITE]} // 원하는 색 배열
          start={{x: 1, y: 0}}
          end={{x: 1, y: 0.3}}
          style={styles.container}
        >
        <SafeAreaView style={{flex: 1, width: SCREEN_W}}>
            {/* 헤더 */}
            <View style={styles.header}>
                <IconButton<PostStackParamList>
                  imageSource={require('@/assets/icons/post/BackArrow.png')}
                  target={'goBack'}
                  size={24}
                  imageStyle={{tintColor: colors.GRAY_300}}
                />
                {isOwner ?
                    <IconButton<MyPageStackParamList>
                        imageSource={require('@/assets/icons/harmonyRoom/Setting.png')}
                        target={[harmonyNavigations.HARMONY_SETTING]}
                    />
                    : <View style={{ width: 24, height: 24 }} />
                }
            </View>

            {/* 하모니룸 */}
            <View style={styles.infoWrap}>
                <View style={styles.nameAndTag}>
                    <Image source={{uri: "https://randomuser.me/api/portraits/men/33.jpg"}} style={styles.roomImg}/>
                    <View style={styles.roomInfo}>
                        <View style={styles.nameWrap}>
                            <Text style={styles.name}>하모니룸</Text>
                            {isOwner ?
                                <Text style={styles.manageLabel}>운영</Text>
                                : <></>
                            }
                        </View>
                        <View style={styles.tagWrap}>
                            <Text style={styles.tags}># 키워드</Text>
                            <Text style={styles.tags}># 키워드</Text>
                            <Text style={styles.tags}># 키워드</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.descriptionWrap}>
                    <Text style={styles.description}>활동 내용 활동 내용 활동 내용 활동 내용 활동 내용 활동 내용 활동 내용 활동 내용</Text>
                </View>
            </View>

            {/* 멤버 정보 */}
            <View style={styles.memAndRankWrap}>
                <View style={styles.memAndRank}>
                    <View style={styles.section}>
                        <Text style={styles.title}>멤버</Text>
                        <Text style={styles.content}>00명</Text>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.title}>랭킹</Text>
                        <Text style={styles.content}>00위</Text>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.title}>누적 피드</Text>
                        <Text style={styles.content}>00개</Text>
                    </View>
                </View>
            </View>

            {/* 버튼 */}
            <View style={styles.btnWrap}>
                <View style={styles.btn}>
                    <Image source={require('@/assets/icons/harmonyRoom/Favorite.png')} style={styles.iconImg}/>
                    <Text style={styles.btnText}>즐겨찾기</Text>
                </View>
                <View style={styles.btn}>
                    <Text style={styles.btnText}>공유</Text>
                </View>
            </View>

            {/* 나가기 */}
            { isMember && (
                <View style={styles.outWrap}>
                    <Pressable onPress={handleOut}>
                        <Text style={styles.outText}>하모니룸 나가기</Text>
                    </Pressable>
                </View>
                )
            }

            {/* 고정된 버튼 */}
            {(!isMember && !isOwner) && (
                <View style={styles.bottom}>
                    <CustomButton
                        label="가입하기"
                        onPress={handleAccess}
                        style={{backgroundColor:colors.BLUE_500}}
                    />
                </View>
            )}

            {/* }<CheckPopupOneBtn
                visible={showExitPopup}
                onClose={handleConfirmExit}
                iconImg={require('@/assets/icons/Access.png')}
                title="가입 신청 완료"
                content="승인되면 알림으로 알려드릴게요."
                btnColor={colors.BLUE_400}
                btnText="확인"
                btnTextColor={colors.WHITE}
            />*/}
            <CheckPopupOneBtn
                visible={showExitPopup}
                onClose={handleConfirmExit}
                iconImg={require('@/assets/icons/Access.png')}
                title="가입 완료"
                content="하모니룸에 가입되었어요."
                btnColor={colors.BLUE_400}
                btnText="확인"
                btnTextColor={colors.WHITE}
            />


            {/* 나가기 확인 팝업 */}
            <CheckPopup
                visible={showOutPopup}
                onClose={handleCancelExit}
                onExit={handleOutAccess}
                title="이 하모니룸에서 나갈까요?"
                content="나가시면 다시 가입 신청을 해야 해요."
                leftBtnColor={colors.WHITE}
                leftBtnTextColor={colors.ERROR_RED}
                leftBtnBorderColor={colors.ERROR_RED}
                leftBtnText="나가기"
                rightBtnColor={colors.BLUE_400}
                rightBtnTextColor={colors.WHITE}
                rightBtnText="머무르기"
            />
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.WHITE,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.LINE_GREY,
    },
    infoWrap:{
        paddingHorizontal: 20,
        paddingVertical: 16,
        gap: 24,
    },
    nameAndTag: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    roomImg: {
        width: 84,
        height: 84,
        borderRadius: 999,
        backgroundColor: colors.GRAY_500,
    },
    roomInfo: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
    },
    nameWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    name: {
        fontFamily: 'Noto Sans KR',
        fontSize: 17,
        fontWeight: '500',
        letterSpacing: 0.1,
        lineHeight: 24,
        color: colors.GRAY_600,
    },
    manageLabel: {
        paddingVertical: 2,
        paddingHorizontal: 10,
        borderRadius: 999,
        backgroundColor: colors.BLUE_300,
        color: colors.BLUE_500,
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Noto Sans KR',
        fontSize: 14,
        fontWeight: '500',
        letterSpacing: 0.2,
        lineHeight: 20,
    },
    tagWrap: {
        flexDirection: 'row',
        gap: 9,
    },
    tags: {
        fontFamily: 'Noto Sans KR',
        fontSize: 14,
        fontWeight: '500',
        letterSpacing: 0.2,
        lineHeight: 20,
        color: colors.BLUE_600,
    },
    descriptionWrap: {
        borderRadius: 16,
        backgroundColor: colors.BLUE_200,
        padding:16,
    },
    description: {
        fontFamily: 'Noto Sans KR',
        fontSize: 12,
        fontWeight: '400',
        letterSpacing: 0.2,
        lineHeight: 16,
        color: colors.BLUE_700,
    },
    memAndRankWrap: {
        paddingVertical: 16,
        paddingHorizontal: 20,
    },
    memAndRank: {
        borderRadius: 9,
        borderWidth: 1,
        borderColor: colors.LINE_GREY,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 61,
        paddingHorizontal: 52,
        paddingVertical: 15,
    },
    section: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 11,
    },
    title: {
        fontFamily: 'Noto Sans KR',
        fontSize: 14,
        fontWeight: '500',
        letterSpacing: 0.2,
        lineHeight: 20,
        color: colors.BLACK,
    },
    content: {
        fontFamily: 'Noto Sans KR',
        fontSize: 12,
        fontWeight: '400',
        letterSpacing: 0.2,
        lineHeight: 16,
        color: colors.GRAY_500,
    },
    btnWrap: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
        paddingVertical: 16,
    },
    btn: {
        paddingVertical: 8,
        paddingHorizontal: 10,
        gap: 3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.GRAY_100,
        borderRadius: 8,
        width: 86,
    },
    iconImg: {
        width: 18,
        height: 18,
    },
    btnText: {
        fontFamily: 'Noto Sans KR',
        fontSize: 12,
        fontWeight: '400',
        letterSpacing: 0.2,
        lineHeight: 16,
        color: colors.GRAY_600,
    },
    bottom : {
        marginBottom: 30,
        paddingHorizontal: 20,
        marginTop: 'auto',
        paddingTop: 6,
    },
    outWrap: {
        paddingHorizontal: 10,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    outText: {
        fontFamily: 'Noto Sans KR',
        fontSize: 11,
        fontWeight: '400',
        letterSpacing: 0.35,
        lineHeight: 14,
        color: colors.GRAY_300,
    },
});