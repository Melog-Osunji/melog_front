import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';

// (옵션) 이미 프로젝트에 있다면 사용. 없으면 useGradient=false로 사용하세요.
let LG: any = View;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  LG = require('react-native-linear-gradient').default;
} catch {}

const { width: SCREEN_W } = Dimensions.get('window');
const COLS = 7;
const CELL = Math.floor((SCREEN_W - 48) / COLS); // 좌우 24px 패딩 가정
const GRID_ROW_H = 48; // 숫자 한 줄 높이
const HEADER_H = 72;   // "YYYY.MM" + 좌우 화살표 영역
const STRIP_H = 80;    // 주간 스트립 높이
const PADDING_V = 8;

type Marked = Record<string, boolean>;

type Props = {
  initialDate?: string;                  // 'YYYY-MM-DD'
  markedDates?: Marked;                  // {'2025-07-17': true}
  onDateChange?: (iso: string) => void;
  useGradient?: boolean;                 // 상단 그라데이션 사용 여부
  gradientColors?: string[];             // ['#EFFAFF', '#FFFFFF']
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
  gradientColors = ['#EFFAFF', '#FFFFFF'],
}: Props) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const init = fromISO(initialDate);
    return new Date(init.getFullYear(), init.getMonth(), 1);
  });
  const [selected, setSelected] = useState<Date>(() => fromISO(initialDate));

  const grid = useMemo(() => getMonthGrid(currentMonth), [currentMonth]);
  const strip = useMemo(() => getWeekStrip(selected), [selected]);

  // expand/collapse
  const EXPANDED_H = HEADER_H + PADDING_V * 2 + GRID_ROW_H * 6 + 8; // 6줄 그리드
  const COLLAPSED_H = HEADER_H + STRIP_H + PADDING_V * 2;

  const [isExpanded, setExpanded] = useState(true);
  const animH = useRef(new Animated.Value(EXPANDED_H)).current;
  const startH = useRef(EXPANDED_H);

  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 6,
      onPanResponderGrant: () => {
        startH.current = (animH as any)._value ?? (isExpanded ? EXPANDED_H : COLLAPSED_H);
      },
      onPanResponderMove: (_, g) => {
        const next = clamp(startH.current + g.dy, COLLAPSED_H, EXPANDED_H);
        animH.setValue(next);
      },
      onPanResponderRelease: (_, g) => {
        const halfway = (EXPANDED_H + COLLAPSED_H) / 2;
        const shouldExpand =
          g.vy < -0.3 ? false : g.vy > 0.3 ? true : (animH as any)._value > halfway;
        snapTo(shouldExpand ? EXPANDED_H : COLLAPSED_H, shouldExpand);
      },
    })
  ).current;

  function snapTo(height: number, expand: boolean) {
    Animated.spring(animH, { toValue: height, useNativeDriver: false, damping: 15, stiffness: 140 })
      .start(() => setExpanded(expand));
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
    setSelected(d);
    onDateChange?.(toISO(d));
  }

  const title = `${currentMonth.getFullYear()}.${String(currentMonth.getMonth() + 1).padStart(2, '0')}`;
  const selectedISO = toISO(selected);

  return (
    <Animated.View style={[styles.container, { height: animH }]} {...pan.panHandlers}>
      {useGradient ? (
        <LG colors={gradientColors} start={{ x: 1, y: 0 }} end={{ x: 1, y: 1 }} style={styles.fill}>
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
          <View style={styles.handle} />
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
          <View style={styles.handle} />
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
          <Text style={styles.chev}>{'‹'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onNext} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={styles.chev}>{'›'}</Text>
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
}: {
  date: Date;
  isSelected: boolean;
  dimmed?: boolean;
  showDot?: boolean;
  onPress: () => void;
}) {
  const day = date.getDate();
  return (
    <TouchableOpacity style={styles.cell} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.dayWrap, isSelected && styles.selWrap]}>
        {isSelected ? (
          <LG
            colors={['#18CAE6', '#6F8BEA']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.selBg}
          >
            <Text style={[styles.daySel]}>{day}</Text>
          </LG>
        ) : (
          <Text style={[styles.day, dimmed && styles.dim]}>{day}</Text>
        )}
      </View>
      {!isSelected && showDot && <View style={styles.dot} />}
    </TouchableOpacity>
  );
}

function MonthGrid({
  grid,
  selectedISO,
  onSelect,
  markedDates,
}: {
  grid: { date: Date; inMonth: boolean }[];
  selectedISO: string;
  onSelect: (d: Date) => void;
  markedDates: Marked;
}) {
  return (
    <View style={styles.grid}>
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
}: {
  days: Date[];
  selectedISO: string;
  onSelect: (d: Date) => void;
  markedDates: Marked;
}) {
  return (
    <View style={styles.strip}>
      {days.map((d) => {
        const iso = toISO(d);
        const isSel = iso === selectedISO;
        const dot = !!markedDates[iso];
        return (
          <DayBubble
            key={iso}
            date={d}
            isSelected={isSel}
            showDot={dot}
            onPress={() => onSelect(d)}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  fill: { flex: 1, paddingHorizontal: 24, paddingVertical: PADDING_V },
  header: {
    height: HEADER_H - 8,
    justifyContent: 'flex-end',
    paddingBottom: 8,
  },
  title: { fontSize: 28, fontWeight: '700', color: '#242424' },
  nav: {
    position: 'absolute',
    right: 0,
    bottom: 8,
    flexDirection: 'row',
    gap: 16,
  },
  chev: { fontSize: 22, color: '#62707C' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 8,
  },
  cell: {
    width: CELL,
    height: GRID_ROW_H,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayWrap: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 18 },
  selWrap: { width: 44, height: 44, borderRadius: 22 },
  selBg: { width: '100%', height: '100%', borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  day: { fontSize: 18, color: '#222' },
  daySel: { fontSize: 18, color: '#fff', fontWeight: '700' },
  dim: { color: '#B8C0C8' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#18CAE6', marginTop: 2 },
  strip: {
    height: STRIP_H,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  handle: {
    alignSelf: 'center',
    width: 80,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E7EDF2',
    marginTop: 6,
  },
});
