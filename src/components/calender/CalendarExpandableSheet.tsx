import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { CalendarProvider, ExpandableCalendar } from 'react-native-calendars';
import LinearGradient from 'react-native-linear-gradient';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { colors } from '@/constants';

dayjs.locale('ko');

const { width: SCREEN_W } = Dimensions.get('window');

type Props = {
  performanceData: any[];
  onDateSelect?: (date: string) => void;
};

export default function CalendarExpandableSheet({ performanceData, onDateSelect }: Props) {
  const today = dayjs().format('YYYY-MM-DD');
  const [selectedDate, setSelectedDate] = useState(today);

  // 마킹 데이터
  const markedDates = useMemo(() => {
    const m: Record<string, any> = {};
    performanceData.forEach(p => {
      if (p.isBookmark) {
        const key = dayjs(p.startDate).format('YYYY-MM-DD');
        m[key] = { ...(m[key] || {}), marked: true, dotColor: '#1E90FF' };
      }
    });
    if (selectedDate) {
      m[selectedDate] = { ...(m[selectedDate] || {}), selected: true };
    }
    return m;
  }, [performanceData, selectedDate]);

  // Day 셀 커스텀
  const DayCell = ({ date, state, marking, style }: any) => {
    if (!date) return null;
    const isSelected = !!marking?.selected;
    const isDisabled = state === 'disabled';

/*     let content: React.ReactNode = (
        <>
        <Text style={[styles.dayText, disabled && { color: colors.GRAY_300 }]}>{date.day}</Text>
        {marking?.marked && <View style={styles.dot} />}
        </>
    ); */

/*     if (isSelected) {
      content = (
        <LinearGradient
          colors={['#08C6D3', '#A0B4E4']}
          style={styles.selectedBadge}
        >
          <Text style={styles.selectedText}>{date.day}</Text>
        </LinearGradient>
      );
    } else if (isToday) {
      content = (
          <>
        <Text style={styles.todayText}>{date.day}</Text>
        </>
      );
    } */

    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedDate(date.dateString);
          onDateSelect?.(date.dateString);
        }}
        style={[style, styles.dayCell]}
      >
        {isSelected ? (
            <LinearGradient colors={['#08C6D3', '#A0B4E4']} style={styles.badge}>
              <Text style={styles.selectedText}>{date.day}</Text>
            </LinearGradient>
          ) : (
            <Text style={[styles.dayText, isDisabled && {color: colors.GRAY_300}]}>
              {date.day}
            </Text>
          )}
        {marking?.marked && <View style={styles.dot} />}
      </TouchableOpacity>
    );
  };

  // 헤더 (YYYY.MM)
  const renderHeader = (date: any) => {
    return (
      <Text style={styles.topTitle}>
        {dayjs(date?.toString()).format('YYYY.MM')}
      </Text>
    );
  };

  return (
    <View style={styles.card}>
      <CalendarProvider date={selectedDate}>
        <ExpandableCalendar
          initialPosition={'open'} // 시작 시 월간 펼침
          onDayPress={d => {
            setSelectedDate(d.dateString);
            onDateSelect?.(d.dateString);
          }}
          markedDates={markedDates}
          renderHeader={renderHeader}
          dayComponent={DayCell}
          disablePan={false} // 스와이프 가능
          theme={{
            calendarBackground: 'transparent',
            textSectionTitleColor: colors.GRAY_500,
            monthTextColor: colors.BLACK,
            selectedDayBackgroundColor: 'transparent', // 기본 선택 스타일 제거
            selectedDayTextColor: 'transparent', // 기본 선택 텍스트 제거
            todayTextColor: 'transparent',
            textDayFontSize: 15,
            textMonthFontSize: 18,
          }}
        />
      </CalendarProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: SCREEN_W,
    backgroundColor: 'transparent',
    borderRadius: 20,
    marginTop: 8,
    overflow: 'hidden',
  },

  topTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.BLACK,
    textAlign: 'left',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 6,
  },

  // Day 셀
  dayCell: { alignItems: 'center', justifyContent: 'center' },
  dayText: { fontSize: 15, color: colors.BLACK, fontWeight: '400' },
  todayText: { color: colors.BLUE_500, fontWeight: '700', fontSize: 16,  marginTop:4, },
  badge: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  selectedText: { color: colors.WHITE, fontSize: 16, fontWeight: '700', marginTop:4, },
  dot: { position: 'absolute', bottom: 4, width: 6, height: 6, borderRadius: 3, backgroundColor: '#1E90FF' },

  // 핸들
  handleBar: {
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.LINE_GREY,
  },
  handle: { width: 44, height: 4, borderRadius: 2, backgroundColor: colors.GRAY_300 },
});
