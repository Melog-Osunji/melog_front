import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
  Image,
  Easing,
} from 'react-native';
import {colors} from '@/constants';
import { useWindowDimensions } from 'react-native';
import NextBtn from '@/assets/icons/calender/clNextBtn.svg';
import PrevBtn from '@/assets/icons/calender/clPrevBtn.svg';


// (옵션) 이미 프로젝트에 있다면 사용. 없으면 useGradient=false로 사용하세요.
let LG: any = View;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  LG = require('react-native-linear-gradient').default;
} catch {}

const COLS = 7;
const GRID_ROW_H = 44;
const HEADER_H = 36;   // "YYYY.MM" + 좌우 화살표 영역
const STRIP_H = 60;    // 주간 스트립 높이
const PADDING_V = 8;
const PADDING_H = 20;
const HANDLE_H = 32; // handle 높이 4 + 상하 여백 16


type Marked = Record<string, boolean>;

type Props = {
  initialDate?: string;                  // 'YYYY-MM-DD'
  markedDates?: Marked;                  // {'2025-07-17': true}
  onDateChange?: (iso: string) => void;
  useGradient?: boolean;                 // 상단 그라데이션 사용 여부
  gradientColors?: string[];             // ['#EFFAFF', '#FFFFFF']
  onDragStateChange?: (dragging: boolean) => void; // 드래그 시작/끝 알림
};

function toISO(d: Date) {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${day}`;
}
function fromISO(iso?: string) {
  if (!iso) return new Date();
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, (m as number) - 1, d as number);
}
function addMonths(d: Date, diff: number) {
  const nd = new Date(d);
  nd.setMonth(nd.getMonth() + diff);
  return nd;
}
function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function daysInMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}
function getMonthGrid(base: Date) {
  // 6주 = 42칸(앞/뒤 이전·다음달 날짜 포함)
  const first = startOfMonth(base);
  const firstDow = first.getDay(); // 0:Sun ~ 6:Sat
  const start = new Date(first);
  start.setDate(1 - firstDow);
  const cells: { date: Date; inMonth: boolean }[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    cells.push({ date: d, inMonth: d.getMonth() === base.getMonth() });
  }
  return cells;
}
function getWeekStrip(target: Date) {
  const start = new Date(target);
  start.setDate(target.getDate() - target.getDay()); // 주의 일요일
  const arr: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    arr.push(d);
  }
  return arr;
}

export default function CalendarTopSheet({
  initialDate,
  markedDates = {},
  onDateChange,
  useGradient = true,
  gradientColors = ['transparent', '#FFFFFF'],
  onDragStateChange,
}: Props) {
  const { width: windowW } = useWindowDimensions();
  const usableW = Math.max(0, windowW - PADDING_H * 2);
  const CELL = Math.floor(usableW / COLS);
  const gridWidth = CELL * COLS;

  const [currentMonth, setCurrentMonth] = useState(() => {
    const init = fromISO(initialDate);
    return new Date(init.getFullYear(), init.getMonth(), 1);
  });
  const [selected, setSelected] = useState<Date>(() => fromISO(initialDate));

  const grid = useMemo(() => getMonthGrid(currentMonth), [currentMonth]);
  const strip = useMemo(() => getWeekStrip(selected), [selected]);

  // expand/collapse
  const EXPANDED_H = HEADER_H + PADDING_V * 2 + GRID_ROW_H * 6 + 8 + HANDLE_H + 16;
  const COLLAPSED_H = HEADER_H + STRIP_H + PADDING_V * 2 + HANDLE_H + 24;

  const [isExpanded, setExpanded] = useState(true);
  const expandedRef = useRef(isExpanded);
  const startTs = useRef(0);
  const startY = useRef(0);
  const animH = useRef(new Animated.Value(EXPANDED_H)).current;
  const startH = useRef(EXPANDED_H);

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 6,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        startH.current = (animH as any)._value ?? (isExpanded ? EXPANDED_H : COLLAPSED_H);
        onDragStateChange?.(true);
        startTs.current = Date.now();
        startY.current = (animH as any)._value;
      },
      onPanResponderMove: (_, g) => {
        const next = clamp(startH.current + g.dy, COLLAPSED_H, EXPANDED_H);
        animH.setValue(next);
      },
      onPanResponderRelease: (_, g) => {
        const duration = Date.now() - startTs.current;
        const isTap = Math.abs(g.dy) < 6 && duration < 200;
        if (isTap) {
            const targetExpand = !expandedRef.current;
            snapTo(targetExpand ? EXPANDED_H : COLLAPSED_H, targetExpand);
            onDragStateChange?.(false);
            return;
        }
        const halfway = (EXPANDED_H + COLLAPSED_H) / 2;
        const shouldExpand =
          g.vy < -0.3 ? false : g.vy > 0.3 ? true : (animH as any)._value > halfway;
        snapTo(shouldExpand ? EXPANDED_H : COLLAPSED_H, shouldExpand);
        onDragStateChange?.(false);
      },
      onPanResponderTerminate: () => {
        onDragStateChange?.(false);
      },
    })
  ).current;

  function snapTo(height: number, expand: boolean) {
    setExpanded(expand);
    expandedRef.current = expand;
    Animated.timing(animH, {
      toValue: height,
      duration: 180,    // 150~220ms 권장
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false, // height 애니메이션은 false 필수
    }).start();
  }

  function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
  }

  function moveMonth(diff: number) {
    const next = addMonths(currentMonth, diff);
    setCurrentMonth(next);
    // 현재 선택일이 다음 달에 없을 수 있으니, 같은 일자로 보정
    const tmp = new Date(selected);
    tmp.setMonth(tmp.getMonth() + diff);
    setSelected(tmp);
    onDateChange?.(toISO(tmp));
  }

  function handleSelect(d: Date) {
    const iso = toISO(d);

    // 선택 월이 현재 월과 다르면 자동 이동
    if (d.getMonth() !== currentMonth.getMonth()) {
      const newMonth = new Date(d.getFullYear(), d.getMonth(), 1);
      setCurrentMonth(newMonth);
    }

    setSelected(d);
    onDateChange?.(iso);
  }

  const title = `${currentMonth.getFullYear()}.${String(currentMonth.getMonth() + 1).padStart(2, '0')}`;
  const selectedISO = toISO(selected);

  return (
    <Animated.View style={[styles.container, { height: animH }]}>
      {useGradient ? (
        <LG colors={gradientColors} start={{ x: 1, y: 0 }} end={{ x: 1, y: 1 }} style={styles.fill}>
          <Header title={title} onPrev={() => moveMonth(-1)} onNext={() => moveMonth(1)} />
          {isExpanded ? (
            <MonthGrid
              grid={grid}
              selectedISO={selectedISO}
              onSelect={handleSelect}
              markedDates={markedDates}
              cellW={CELL}
              gridW={gridWidth}
            />
          ) : (
            <WeekStrip
              days={strip}
              selectedISO={selectedISO}
              onSelect={handleSelect}
              markedDates={markedDates}
              cellW={CELL}
              gridW={gridWidth}
              currentMonth={currentMonth}
            />
          )}
          <View style={styles.handleWrap} {...pan.panHandlers} hitSlop={{top:10,bottom:10,left:20,right:20}}>
            <View style={styles.handle} />
          </View>
        </LG>
      ) : (
        <View style={[styles.fill, { backgroundColor: '#FFFFFF' }]}>
          <Header title={title} onPrev={() => moveMonth(-1)} onNext={() => moveMonth(1)} />
          {isExpanded ? (
            <MonthGrid
              grid={grid}
              selectedISO={selectedISO}
              onSelect={handleSelect}
              markedDates={markedDates}
            />
          ) : (
            <WeekStrip
              days={strip}
              selectedISO={selectedISO}
              onSelect={handleSelect}
              markedDates={markedDates}
            />
          )}
          <View style={styles.handle} {...pan.panHandlers} hitSlop={{top:10,bottom:10,left:20,right:20}}/>
        </View>
      )}
    </Animated.View>
  );
}

function Header({ title, onPrev, onNext }: { title: string; onPrev: () => void; onNext: () => void }) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.nav}>
        <TouchableOpacity onPress={onPrev} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <PrevBtn width={24} height={24} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onNext} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <NextBtn width={24} height={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function DayBubble({
  date,
  isSelected,
  dimmed,
  showDot,
  onPress,
  cellW,
}: {
  date: Date;
  isSelected: boolean;
  dimmed?: boolean;
  showDot?: boolean;
  onPress: () => void;
  cellW: number;
}) {
  const day = date.getDate();
  return (
    <TouchableOpacity style={[styles.cell, { width: cellW }]} onPress={onPress} activeOpacity={0.8}>
        {isSelected ? (
          <LG
            colors={['#08C6D3', '#A0B4E4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.selBg}
          >
            <View style={styles.dayWrap}>
                <Text style={[styles.daySel]}>{day}</Text>
            </View>
            {showDot && <View style={styles.dot} />}

          </LG>
        ) : (
          <View style={styles.selBg}>
              <View style={styles.dayWrap}>
                <Text style={[styles.day, dimmed && styles.dim]}>{day}</Text>
              </View>
              {showDot && <View style={styles.dot} />}
          </View>
        )}
    </TouchableOpacity>
  );
}

function MonthGrid({
  grid,
  selectedISO,
  onSelect,
  markedDates,
  cellW,
  gridW,
}: {
  grid: { date: Date; inMonth: boolean }[];
  selectedISO: string;
  onSelect: (d: Date) => void;
  markedDates: Marked;
  cellW: number;
  gridW: number;
}) {
  return (
    <View style={[styles.grid, { width: gridW, alignSelf: 'center' }]}>
      {grid.map(({ date, inMonth }) => {
        const iso = toISO(date);
        const isSel = iso === selectedISO;
        const dot = !!markedDates[iso];
        return (
          <DayBubble
            key={iso}
            date={date}
            isSelected={isSel}
            dimmed={!inMonth}
            showDot={dot}
            onPress={() => onSelect(date)}
            cellW={cellW}
          />
        );
      })}
    </View>
  );
}

function WeekStrip({
  days,
  selectedISO,
  onSelect,
  markedDates,
  cellW,
  gridW,
  currentMonth
}: {
  days: Date[];
  selectedISO: string;
  onSelect: (d: Date) => void;
  markedDates: Marked;
  cellW: number;
  gridW: number;
  currentMonth: number;
}) {
  return (
    <View style={[styles.strip, { width: gridW, alignSelf: 'center', justifyContent: 'flex-start' }]}>
      {days.map((d) => {
        const iso = toISO(d);
        const isSel = iso === selectedISO;
        const dot = !!markedDates[iso];
        const dimmed = d.getMonth() !== currentMonth.getMonth();

        return (
          <DayBubble
            key={iso}
            date={d}
            isSelected={isSel}
            showDot={dot}
            onPress={() => onSelect(d)}
            cellW={cellW}
            dimmed={dimmed}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
    shadowWrapper: {
      backgroundColor: 'transparent',
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 6 }, // 아래로만 그림자
      elevation: 6, // Android
    },
  container: {
    overflow: 'hidden',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth:1,
    borderBottomColor: colors.GRAY_100,
    borderRightColor: colors.GRAY_100,
    borderLeftColor: colors.GRAY_100,
  },
  fill: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Noto Sans KR',
    fontSize: 20,
    fontWeight: '500',
    color: colors.GRAY_600,
    lineHeight: 28,
  },
  nav: {
    flexDirection: 'row',
    gap: 8,
  },
  chev: { width: 24, height:24 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    height: GRID_ROW_H,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  selBg: { width: 32, height: 44, borderRadius: 999, alignItems: 'center', justifyContent: 'flex-start' },
  dayWrap: {
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
  },
  day: {
    fontFamily: 'Noto Sans KR',
    fontSize: 15,
    fontWeight: '400',
    color: colors.GRAY_600,
    lineHeight: 22,
    letterSpacing: 0.15,
  },
  daySel: {
    fontFamily: 'Noto Sans KR',
    fontSize: 15,
    fontWeight: '500',
    color: colors.WHITE,
    lineHeight: 22,
    letterSpacing: 0.15,
  },
  dim: { color: colors.GRAY_200 },
  dot: { width: 8, height: 8, borderRadius: 99, backgroundColor: colors.BLUE_500, },
  strip: {
    height: STRIP_H,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
  },
  handleWrap: {
    paddingTop:12,
  },
  handle: {
    alignSelf: 'center',
    width: 48,
    height: 4,
    borderRadius: 999,
    backgroundColor: '#E5E5E5',
  },
});
