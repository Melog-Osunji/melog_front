import React, {useState, useEffect} from 'react';
import {StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    Dimensions,
    FlatList,
    TextInput,
    TouchableOpacity,
    Keyboard,
    Platform,
    KeyboardAvoidingView
    } from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {HarmonyStackParamList} from '@/navigations/stack/HarmonyStackNavigator';
import styled from 'styled-components/native';
import {colors, harmonyNavigations} from '@/constants';
import IconButton from '@/components/common/IconButton';
import YouTubeEmbed from '@/components/common/YouTubeEmbed';
import {useHideTabBarOnFocus} from '@/utils/roadBottomNavigationBar';
import TagInputBox from '@/components/harmonyRoom/TagInputBox';
import MusicSearchBottomSheet from '@/components/post/MusicSearchBottomSheet';

const DEVICE_WIDTH = Dimensions.get('window').width;

function HarmonyCreateScreen() {
    const navigation = useNavigation();

    useHideTabBarOnFocus();

    const [roomName, setRoomName] = useState('');
    const [description, setDescription] = useState('');
    const [personCount, setPersonCount] = useState(0);
    const [tags, setTags] = useState([]);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [isMusicSearchVisible, setIsMusicSearchVisible] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);


    const handleMusicPress = () => {
        setIsMusicSearchVisible(true);
    };

    const handleVideoSelect = (video: YouTubeVideo) => {
      setIsMusicSearchVisible(false);
      setSelectedVideo(video);
    };
    const handleRemoveVideo = () => {
        setSelectedVideo(null);
    };

    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
          setKeyboardVisible(true);
        });
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
          setKeyboardVisible(false);
        });

        return () => {
          showSubscription.remove();
          hideSubscription.remove();
        };
    }, []);


    // YouTube URL에서 비디오 ID 추출하는 함수
      const extractVideoId = (url: string) => {
        const regex =
          /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(regex);
        return match ? match[1] : 'dQw4w9WgXcQ'; // 기본값
      };

    return (
        <>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <IconButton<PostStackParamList>
                  imageSource={require('@/assets/icons/post/BackArrow.png')}
                  target={'goBack'}
                  size={24}
                />
            </View>
            <Text style={styles.sectionTitle}>하모니룸 제작하기</Text>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
            {/* 검색바 */}
            <View style={styles.searchContainer}>
              {/* selectedVideo가 없을 때만 검색창 노출 */}
              {!selectedVideo && (
                <>
                  <TouchableOpacity style={styles.searchInputContainer} onPress={handleMusicPress}>
                    <Image
                      source={require('@/assets/icons/post/Search.png')}
                      style={styles.searchIcon}
                    />
                    <Text style={styles.searchInput}>어떤 클래식을 찾고있나요?</Text>
                  </TouchableOpacity>
                  <Text style={styles.searchGuide}>함께 듣고 싶은 클래식 영상 혹은 음원을 찾아보세요.</Text>
                </>
              )}

              {/* 선택된 비디오가 있을 때만 유튜브 영상 및 제거 버튼 노출 */}
              {selectedVideo && (
                <View style={styles.selectedVideoContainer}>
                  <View style={styles.videoEmbedWrapper}>
                    <YouTubeEmbed
                      url={`https://www.youtube.com/watch?v=${extractVideoId(
                        selectedVideo.thumbnail,
                      )}`}
                    />
                    <TouchableOpacity
                      style={styles.removeVideoButton}
                      onPress={handleRemoveVideo}
                    >
                      <Text style={styles.removeVideoText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>


            {/* 방 이름 */}
            <View style={styles.section}>
                <Text style={styles.label}>방 이름</Text>
                <TextInput
                  style={styles.input}
                  placeholder="방과 어울리는 제목으로 지어주세요🎶"
                  placeholderTextColor={colors.GRAY_400}
                  maxLength={25}
                  value={roomName}
                  onChangeText={setRoomName}
                />
            </View>

            {/* 설정 인원 */}
            <View style={styles.section}>
                <Text style={styles.label}>설정 인원</Text>
                <View style={styles.countRow}>
                  <TouchableOpacity
                    disabled={personCount === 0}
                    onPress={() => setPersonCount(prev => Math.max(0, prev - 1))}>
                    <Image
                    source={personCount === 0
                        ? require('@/assets/icons/harmonyRoom/MinusDisabled.png')
                        : require('@/assets/icons/harmonyRoom/MinusEnabled.png')}
                        style={styles.icon}
                        />
                  </TouchableOpacity>
                  <View style={styles.countTextBox}>
                      <Text style={styles.countText}>
                        {personCount.toString().padStart(2, '0')}
                      </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setPersonCount(prev => prev + 1)}>
                    <Image
                        source={require('@/assets/icons/harmonyRoom/PlusEnabled.png')}
                        style={styles.icon}
                    />
                  </TouchableOpacity>
                </View>
            </View>

            {/* 카테고리 */}
            <View style={styles.section}>
                <Text style={styles.label}>카테고리</Text>
                <TagInputBox tags={tags} setTags={setTags} />
            </View>

            {/* 방 설명 */}
            <View style={styles.section}>
                <Text style={styles.label}>방 설명</Text>
                <TextInput
                  style={styles.textArea}
                  placeholder="텍스트를 입력해주세요."
                  placeholderTextColor={colors.GRAY_400}
                  multiline
                  maxLength={300}
                  value={description}
                  onChangeText={setDescription}
                />
            </View>
            </ScrollView>

            {/* 고정된 버튼 */}
            {!isKeyboardVisible && (
              <View style={styles.floatingButtonContainer}>
                <TouchableOpacity style={styles.floatingButton}>
                  <Text style={styles.floatingButtonText}>제작하기</Text>
                </TouchableOpacity>
              </View>
            )}
        </SafeAreaView>
        </KeyboardAvoidingView>
        <MusicSearchBottomSheet
            visible={isMusicSearchVisible}
            onClose={() => setIsMusicSearchVisible(false)}
            onVideoSelect={handleVideoSelect}
        />
        </>
        );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingBottom:80,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        height:58,
    },
    sectionTitle: {
        fontSize: 17,
        lineHeight:24,
        fontWeight: '600',
        color: colors.GRAY_600,
        paddingHorizontal:20,
        marginBottom:30,
    },
    searchContainer: {
        marginBottom: 24,
        paddingHorizontal:20,
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.GRAY_100,
        borderRadius: 8,
        paddingHorizontal: 8,
        height: 44,
        gap: 8,
        marginBottom: 6,
    },
    searchIcon: {
        width: 24,
        height: 24,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 0.2,
        color: colors.GRAY_300,
        fontFamily: 'Noto Sans KR',
    },
    searchGuide: {
        fontSize:12,
        fontWeight:'400',
        color: '#659CC7',
        lineHeight:16,
    },
    section: {
        flexDirection:"column",
        gap:8,
        paddingHorizontal:20,
        marginBottom:18,
    },
    label: {
        fontSize:14,
        lineHeight:20,
        fontFamily: 'Noto Sans KR',
        color:colors.GRAY_600,
        fontWeight:'bold',
    },
    input: {
        height:44,
        padding:12,
        borderWidth: 1,
        borderColor: colors.GRAY_200,
        borderRadius: 8,
    },
    countRow: {
        flexDirection:"row",
        justifyContent:'flex-start',
        alignItems:'center',
        gap:8,
    },
    icon: {
        width:32,
        height:32,
    },
    countTextBox: {
        width: 86,
        height:44,
        justifyContent:'center',
        alignItems:'center',
        borderWidth: 1,
        borderColor: colors.GRAY_200,
        borderRadius: 8,
    },
    countText:{
        fontSize:15,
        fontWeight:'600',
        lineHeight:22,
        color:colors.GRAY_500,
    },
    textArea: {
        padding:12,
        textAlignVertical: 'top',
        borderWidth: 1,
        borderColor: colors.GRAY_200,
        borderRadius: 8,
        height:98,
    },
    floatingButtonContainer: {
        width: DEVICE_WIDTH,
        position: 'absolute',
        backgroundColor:colors.WHITE,
        bottom:0,
        zIndex: 10,
        paddingHorizontal:20,
        paddingVertical:16,
        paddingBottom: 28,
        ...Platform.select({
          android: {
            elevation: 5, // 안드로이드는 elevation 필요
          },
        }),
    },
    floatingButton: {
        backgroundColor: colors.BLUE_400,
        borderRadius: 32,
        alignItems: 'center',
        borderRadius:100,
        height:52,
        justifyContent:"center",
      },
    floatingButtonText: {
        color: colors.WHITE,
        fontSize: 15,
        lineHeight:32,
        fontWeight: 'bold',
        fontFamily: 'Noto Sans KR',
    },
    selectedVideoContainer: {
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        padding: 16,
        marginVertical: 16,
    },
    videoEmbedWrapper: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
    },
    removeVideoButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
});

export default HarmonyCreateScreen;
