import React, { useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Animated, PanResponder } from 'react-native';
import { Calendar } from 'react-native-calendars';
import LinearGradient from 'react-native-linear-gradient';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { colors } from '@/constants';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';


dayjs.locale('ko');

const { width: SCREEN_W } = Dimensions.get('window');
type Props = { performanceData: any[]; onDateSelect?: (date: string) => void; };

const TITLE_H  = 44;   // "YYYY.MM" 타이틀 영역 대략
const HANDLE_H = 28;   // handleBar 전체(패딩 포함) 높이
const SAFE_PAD = 8;


export default function CalendarTopSheet({ performanceData, onDateSelect }: Props) {
  // 상태
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [monthCursor, setMonthCursor] = useState(dayjs()); // 현재 표시 월
  const [expanded, setExpanded] = useState(true);

  // 높이 애니메이션: 초기는 펼침이므로 1
  const [collapsedH, setCollapsedH] = useState<number>(160);
  const [expandedH, setExpandedH] = useState<number>(380); // 측정 전 임시값
  const progress = useRef(new Animated.Value(1)).current;
  const height = progress.interpolate({ inputRange:[0,1], outputRange:[collapsedH, expandedH] });

  const today = dayjs().format('YYYY-MM-DD');

  useFocusEffect(
    useCallback(() => {
      // 복귀할 때 펼침 상태로
      animateTo(1);
    }, [])
  );

  // 마킹
  const markedDates = useMemo(() => {
    const m: Record<string, any> = {};
    performanceData.forEach(p => {
      if (p.isBookmark) {
        const k = dayjs(p.startDate).format('YYYY-MM-DD');
        m[k] = { ...(m[k] || {}), marked: true, dotColor: '#1E90FF' };
      }
    });
    if (selectedDate) m[selectedDate] = { ...(m[selectedDate] || {}), selected: true };
    return m;
  }, [performanceData, selectedDate]);

  // 펼침/접힘 애니메이션
  const animateTo = (to: 0 | 1) =>
    Animated.spring(progress, { toValue: to, useNativeDriver: false }).start(() => setExpanded(to === 1));

  // 핸들 제스처(맨 아래에만)
  const handlePan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > Math.abs(g.dx) && Math.abs(g.dy) > 6,
      onPanResponderMove: (_, g) => {
        const base = expanded ? 1 : 0;
        const delta = g.dy / Math.max(1, expandedH - COLLAPSED_H); // 아래로 양수 → 펼침
        const next = Math.min(1, Math.max(0, base + delta));
        progress.setValue(next);
      },
      onPanResponderRelease: (_, g) => {
        const v = (progress as any).__getValue();
        const shouldExpand = g.vy > 0.5 || v > 0.5;
        animateTo(shouldExpand ? 1 : 0);
      },
    })
  ).current;

  // 날짜 선택
  const onDayPress = (d: any) => {
    setSelectedDate(d.dateString);
    onDateSelect?.(d.dateString);
  };

  // Day 커스텀(시안: 오늘은 그라데, 선택은 둥근 알약)
  const Day = ({ date, state, marking }: any) => {
    const isToday = date?.dateString === today;
    const isSelected = marking?.selected;
    const disabled = state === 'disabled';

    let content: React.ReactNode = (
      <Text style={[styles.dayText, disabled && { color: colors.GRAY_300 }]}>{date?.day}</Text>
    );

    if (isSelected) {
      content = (
        <LinearGradient colors={['#08C6D3', '#A0B4E4']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.selectedBadge}>
          <Text style={styles.selectedText}>{date?.day}</Text>
        </LinearGradient>
      );
    } else if (isToday) {
      content = (
        <LinearGradient colors={['#08C6D3', '#A0B4E4']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.todayBadge}>
          <Text style={styles.todayText}>{date?.day}</Text>
        </LinearGradient>
      );
    }

    return (
      <TouchableOpacity onPress={() => onDayPress(date)} style={styles.dayCell}>
        {content}
        {marking?.marked && <View style={styles.dot} />}
      </TouchableOpacity>
    );
  };

  // 월간 높이 측정 (초기 1회만)
  const onCalendarLayout = (e: any) => {
    const h = e.nativeEvent.layout.height;  // 달력 자체 높이
    // 달력 + 타이틀 + 핸들 + 여유
    const safe = Math.max(340, Math.ceil(h) + TITLE_H + HANDLE_H + SAFE_PAD);
    if (safe !== expandedH) setExpandedH(safe);
  };

  const onWeekLayout = (e:any) => {
    const weekH = e.nativeEvent.layout.height; // 주간 strip 실제 높이
    const safe  = Math.max(140, Math.ceil(weekH) + TITLE_H + HANDLE_H + SAFE_PAD);
    if (safe !== collapsedH) setCollapsedH(safe);
  };

  // 커스텀 헤더(시안: 상단 "YYYY.MM" 제목 + 우측/좌측 화살표는 달력 안)
  const renderCalHeader = () => (
    <View style={styles.calHeaderRow}>
      <TouchableOpacity onPress={() => setMonthCursor(prev => prev.subtract(1, 'month'))} style={styles.arrowBtn}>
        <Text style={styles.arrow}>{'‹'}</Text>
      </TouchableOpacity>
      <Text style={styles.calHeaderMonth}>{monthCursor.format('MMMM YYYY')}</Text>
      <TouchableOpacity onPress={() => setMonthCursor(prev => prev.add(1, 'month'))} style={styles.arrowBtn}>
        <Text style={styles.arrow}>{'›'}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Animated.View style={[styles.card, { height }]}>
      {/* 시안 상단: YYYY.MM */}
      <Text style={styles.topTitle}>{monthCursor.format('YYYY.MM')}</Text>

      {/* 월간 뷰 (펼침 상태에서도 항상 렌더해서 높이 측정) */}
      <View onLayout={onCalendarLayout}>
        <Calendar
          current={monthCursor.format('YYYY-MM-DD')}
          onDayPress={onDayPress}
          markedDates={markedDates}
          markingType="custom"
          dayComponent={Day}
          renderHeader={renderCalHeader}
          hideExtraDays={false}
          theme={{
            calendarBackground: 'transparent',
            textSectionTitleColor: colors.GRAY_500,
            dayTextColor: colors.BLACK,
            monthTextColor: colors.BLACK,
            textDisabledColor: colors.GRAY_300,
            arrowColor: colors.GRAY_600,
          }}
          style={styles.calendar}
        />
      </View>

      {/* 접힌 상태일 때 보이는 주간 스트립 (높이 애니메이션으로 가려짐) */}
      {!expanded && (
        <View style={styles.weekRow} onLayout={onWeekLayout}>
          {[...Array(7)].map((_, i) => {
            const d = dayjs(selectedDate).startOf('week').add(i, 'day');
            const key = d.format('YYYY-MM-DD');
            const isToday = key === today;
            const isSelected = key === selectedDate;
            const hasEvent = !!markedDates[key]?.marked;
            return (
              <TouchableOpacity key={key} style={styles.weekCell} onPress={() => onDayPress({ dateString: key })}>
                <Text style={styles.weekDayName}>{d.format('dd')}</Text>
                {isSelected ? (
                  <LinearGradient colors={['#08C6D3', '#A0B4E4']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.weekBadge}>
                    <Text style={styles.weekBadgeText}>{d.format('D')}</Text>
                  </LinearGradient>
                ) : isToday ? (
                  <LinearGradient colors={['#08C6D3', '#A0B4E4']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.weekBadge}>
                    <Text style={styles.weekBadgeText}>{d.format('D')}</Text>
                  </LinearGradient>
                ) : (
                  <Text style={styles.weekNum}>{d.format('D')}</Text>
                )}
                {hasEvent && <View style={styles.dot} />}
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* 핸들: 맨 아래, 핸들만 제스처 */}
      <View
        style={styles.handleBar}
        {...handlePan.panHandlers}
        onStartShouldSetResponder={() => true}
        onResponderRelease={() => animateTo(expanded ? 0 : 1)} // 탭으로 토글
      >
        <View style={styles.handle} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // 카드(시안 같은 흰색 카드 + 그림자 + 라운드 + 내부 그라데 상단은 배경에서 해결)
  card: {
    width: SCREEN_W,
    backgroundColor: 'transparent',
    borderRadius: 20,
    marginTop: 8,
    paddingBottom: 0,
    overflow: 'hidden', // 내부가 잘리지 않게 height만 애니메이션
  },

  topTitle: { // "2025.07"
    fontSize: 22,
    fontWeight: '700',
    color: colors.BLACK,
    textAlign: 'left',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 6,
  },

  calendar: {
    paddingHorizontal: 10,
    paddingBottom: 6,
  },

  // 달력 내부 헤더(‹ September 2025 ›)
  calHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 8,
    marginBottom: 6,
  },
  calHeaderMonth: { fontSize: 18, fontWeight: '600', color: colors.BLACK },
  arrowBtn: { padding: 8, borderRadius: 20 },
  arrow: { fontSize: 22, color: colors.GRAY_600 },

  // Day 셀
  dayCell: { alignItems: 'center', justifyContent: 'center', paddingVertical: 6 },
  dayText: { fontSize: 16, color: colors.BLACK, fontWeight: '500' },
  todayBadge: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  todayText: { color: colors.WHITE, fontWeight: '700' },
  selectedBadge: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' }, // 시안의 큰 알약
  selectedText: { color: colors.WHITE, fontSize: 16, fontWeight: '700' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#1E90FF', marginTop: 4 },

  // 주간 스트립
  weekRow: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 16, paddingVertical: 14 },
  weekCell: { alignItems: 'center', gap: 6 },
  weekDayName: { fontSize: 12, color: colors.GRAY_500, fontWeight: '500' },
  weekNum: { fontSize: 16, color: colors.BLACK, fontWeight: '500' },
  weekBadge: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  weekBadgeText: { color: colors.WHITE, fontWeight: '700' },

  // 핸들
  handleBar: {
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.LINE_GREY,
  },
  handle: { width: 44, height: 4, borderRadius: 2, backgroundColor: colors.GRAY_300 },
});
