import React,{useState, useEffect} from 'react';
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
import type { CalendarItem } from '@/api/calendar/calendarApi';
import LinearGradient from 'react-native-linear-gradient';
import CheckPopupOneBtn from '@/components/common/CheckPopupOneBtn';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { useSaveCalendarSchedule, useDeleteCalendarSchedule } from '@/hooks/queries/calender/useCalender';


dayjs.locale('ko');

type Props = { data: CalendarItem };

const formatRange = (startISO: string, endISO?: string | null) => {
  const s = dayjs(startISO);
  if (!endISO) return `${s.format('YYYY.MM.DD(ddd)')}`;
  const e = dayjs(endISO);
  const sameYear = s.isSame(e, 'year');
  return sameYear
    ? `${s.format('YYYY.MM.DD(ddd)')} - ${e.format('MM.DD(ddd)')}`
    : `${s.format('YYYY.MM.DD(ddd)')} - ${e.format('YYYY.MM.DD(ddd)')}`;
};

const SCREEN_W = Dimensions.get('window').width;

export default function PerformanceCard({ data, onUpdated, selectedDate }: Props & { onUpdated?: () => void, selectedDate?: string }) {

    const { id, title, venue, startDateTime, endDateTime, dday, bookmarked, thumbnailUrl, category, eventId} = data;

    const [isBook, setIsBook] = useState(bookmarked);
    const [popupMsg, setPopupMsg] = useState('');
    const [showExitPopup,setShowExitPopup] = useState(false);

    const { mutate: saveSchedule, isPending: saving } = useSaveCalendarSchedule();
    const { mutate: deleteSchedule, isPending: deleting } = useDeleteCalendarSchedule();

    useEffect(() => {
        setIsBook(bookmarked);
    }, [bookmarked]);
    // 북마크 추가 함수
    const handleBookmark = () => {
        const prev = isBook;
        const next = !prev;

        const targetDate = selectedDate
          ? dayjs(selectedDate).format('YYYY-MM-DD')
          : dayjs(startDateTime).format('YYYY-MM-DD');

        setIsBook(next);
        setPopupMsg(next ? '캘린더에 저장했어요.' : '캘린더에서 삭제했어요.');
        setShowExitPopup(true);

        // 팝업 메시지 설정
        if (next) {
          // 저장
          saveSchedule(
            {
              eventId: id,
              eventDate: targetDate,
              schedule: true,
              alarm: false,
            },
            {onSuccess: () => {
              onUpdated?.();
              },
              onError: () => {
                // 롤백
                setIsBook(prev);
                setPopupMsg('저장에 실패했어요. 다시 시도해 주세요.');
                setShowExitPopup(true);
              },
            }
          );
        } else {
          // 취소 (주의: scheduleId가 eventId와 동일한지 서버 규약 확인 필요)
          deleteSchedule(
            { scheduleId: eventId },
            { onSuccess: () => {
                onUpdated?.();
              },
              onError: () => {
                // 롤백
                setIsBook(prev);
                setPopupMsg('삭제에 실패했어요. 다시 시도해 주세요.');
                setShowExitPopup(true);
              },
            }
          );
        }
      };

    const disabled = saving || deleting;
    const truncatedTitle = title.length > 24 ? `${title.slice(0, 24)}...` : title;

    return (
        <View style={styles.container}>
            <View style={styles.performanceInfoWrap}>
                {thumbnailUrl ? (
                  <Image source={{ uri: thumbnailUrl }} style={styles.img} />
                ) : (
                  <View style={[styles.img, styles.placeholderImg]} />
                )}
                <View style={styles.performanceInfo}>
                    <LinearGradient
                                colors={['#08C6D3', '#A0B4E4']}
                                start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }}
                                style={styles.gradientWrap}
                    >
                    <Text style={styles.leftDate}>
                        {dday === 0 ? 'D-DAY' : dday > 0 ? `D-${dday}` : '진행중'}
                    </Text>
                    </LinearGradient>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.location}>{venue}</Text>
                    <Text style={styles.period}>{formatRange(startDateTime, endDateTime)}</Text>
                </View>
            </View>
            <Pressable onPress={handleBookmark}>
                { isBook ? <Image source={require('@/assets/icons/post/Bookmark_activate.png')} style={styles.icon}/>
                    : <Image source={require('@/assets/icons/post/Bookmark.png')} style={styles.icon}/>
                }
            </Pressable>

            <CheckPopupOneBtn
              visible={showExitPopup}
              onClose={() => setShowExitPopup(false)}
              iconImg={require('@/assets/icons/post/Notice.png')}
              title={popupMsg}
              btnColor={colors.BLUE_400}
              btnText="확인"
              btnTextColor={colors.WHITE}
            />
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
        alignItems: 'flex-start',
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
        maxWidth: SCREEN_W * 0.55,
        numberOfLines: 1,
        ellipsizeMode: 'tail',
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