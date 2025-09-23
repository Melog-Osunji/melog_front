import React,{useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Pressable
} from 'react-native';
import {colors} from '@/constants';
import {PerformanceData} from '@/constants/dummyData';
import LinearGradient from 'react-native-linear-gradient';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';

type Props = {
  data: PerformanceData;
};

dayjs.locale('ko');

const formatDate = (date:Date) => {
  return dayjs(date).format('YYYY.MM.DD(ddd)');
};
const formatEndDate = (date:Date) => {
  return dayjs(date).format('MM.DD(ddd)');
};

const SCREEN_W = Dimensions.get('window').width;

export default function PerformanceCard({data}:Props) {

    const {id, title, location, startDate, endDate, isBookmark, leftDate, category, imgUrl} = data;

    const [isBook, setIsBook] = useState(false);
    // 북마크 추가 함수
    const handleBookmark = () => {
        setIsBook(prev => !prev);
    };

    return (
        <View style={styles.container}>
            <View style={styles.performanceInfoWrap}>
                {imgUrl ? (
                  <Image source={{ uri: imgUrl }} style={styles.img} />
                ) : (
                  <View style={[styles.img, styles.placeholderImg]} />
                )}
                <View style={styles.performanceInfo}>
                    <LinearGradient
                                colors={['#08C6D3', '#A0B4E4']}
                                start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }}
                                style={styles.gradientWrap}
                    >
                        { leftDate === 0 ? <Text style={styles.leftDate}>D-DAY</Text>
                            : leftDate ? <Text style={styles.leftDate}>D-{String(leftDate)}</Text>
                            : <Text style={styles.leftDate}>마감</Text>
                            }
                    </LinearGradient>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.location}>{location}</Text>
                    <Text style={styles.period}>{formatDate(startDate)}{endDate ? `-${formatEndDate(endDate)}` : null}</Text>
                </View>
            </View>
            <Pressable onPress={handleBookmark}>
                { isBook ? <Image source={require('@/assets/icons/post/Bookmark_activate.png')} style={styles.icon}/>
                    : <Image source={require('@/assets/icons/post/Bookmark.png')} style={styles.icon}/>
                }
            </Pressable>
        </View>
    );

};

const styles = StyleSheet.create({
    container: {
        width: SCREEN_W,
        paddingHorizontal: 20,
        paddingVertical: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    performanceInfoWrap: {
        gap: 14,
        flexDirection: 'row',
        alignItems: 'center',
    },
    img: {
        width: 85,
        height: 108,
    },
    placeholderImg: {
        backgroundColor: colors.GRAY_200,
    },
    performanceInfo: {
        flexDirection: 'column',
        gap: 4,
        alignItems: 'flex-start',
    },
    gradientWrap: {
        height: 20,
        paddingHorizontal: 8,
        borderRadius: 999,
        justifyContent: 'center',
        alignItems: 'center',
    },
    leftDate: {
        fontFamily: 'Noto Sans KR',
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 20,
        letterSpacing: 0.2,
        color: colors.WHITE,
    },
    title: {
        fontFamily: 'Noto Sans KR',
        fontSize: 15,
        fontWeight: '500',
        lineHeight: 22,
        letterSpacing: 0.15,
        color: colors.BLACK,
    },
    location: {
        fontFamily: 'Noto Sans KR',
        fontSize: 12,
        fontWeight: '400',
        lineHeight: 16,
        letterSpacing: 0.2,
        color: colors.BLACK,
    },
    period: {
        fontFamily: 'Noto Sans KR',
        fontSize: 11,
        fontWeight: '400',
        lineHeight: 14,
        letterSpacing: 0.35,
        color: colors.GRAY_300,
    },
    icon: {
        width: 24,
        height: 24,
    },
})