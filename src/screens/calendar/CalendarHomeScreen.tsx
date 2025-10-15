import React, {useState, useMemo, useCallback} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Dimensions, FlatList, ActivityIndicator} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '@/constants';
import IconButton from '@/components/common/IconButton';
import PerformanceCard from '@/components/calender/PerformanceCard';
import CalendarTopSheet from '@/components/calender/CalendarTopSheet';
import {useCalendarMain, buildMarkedDates} from '@/hooks/queries/calender/useCalender';
import { SERVER_TO_KOR } from '@/utils/calenderCategory';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import 'dayjs/locale/ko';
dayjs.extend(isBetween);

const SCREEN_W = Dimensions.get('window').width;

const CATEGORIES = ['전체', '연극', '뮤지컬', '오페라', '음악', '콘서트', '국악', '무용', '전시', '기타'];

function CalenderHomeScreen() {
  const today = dayjs();
  const [listScrollEnabled, setListScrollEnabled] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedDate, setSelectedDate] = useState<string | null>(today.format('YYYY-MM-DD'));

  const { data, isLoading, isError, refetch } = useCalendarMain({});

  const weeks = data?.calendar?.weeks ?? [];
  const items = data?.items ?? [];
  const markedDates = useMemo(() => buildMarkedDates(weeks), [weeks]);

  const stats = useMemo(() => {
    const total = items.length;
    const bookmarked = items.filter(it => it.bookmarked).length;
    const markedDays = Object.keys(markedDates).length;
    return { total, bookmarked, markedDays, alarmOn: !!data?.meta?.alarm };
  }, [items, markedDates, data?.meta?.alarm]);

  const listData = useMemo(() => {
    if (!data?.items) return [];
    const filteredByCategory = selectedCategory === '전체'
      ? data.items
      : data.items.filter(it => SERVER_TO_KOR[it.category] === selectedCategory);

    if (!selectedDate) return filteredByCategory;

    return filteredByCategory.filter(it =>
      dayjs(it.startDateTime).format('YYYY-MM-DD') === selectedDate
      || (it.endDateTime && dayjs(selectedDate).isBetween(
            dayjs(it.startDateTime).startOf('day'),
            dayjs(it.endDateTime).endOf('day'),
            null,
            '[]'
         ))
    );
  }, [data, selectedCategory, selectedDate]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    // 선택된 날짜의 공연만 보여주거나 다른 로직 실행
    console.log('Selected date:', date);
  };

  // 헤더(앱바) + 탑시트 + 카테고리
    const Header = useMemo(() => (
      <>
        <View style={styles.header}>
          <View style={styles.headerTitle}>
            <Image source={require('@/assets/icons/calender/CalenderLogo.png')} style={styles.headerImg}/>
            <Text style={styles.headerText}>캘린더</Text>
          </View>
          <IconButton imageSource={require('@/assets/icons/post/Notice.png')} />
        </View>

        {/* 탑시트 */}
        <CalendarTopSheet
            initialDate={selectedDate ?? undefined}
            markedDates={markedDates}
            onDateChange={setSelectedDate}
            useGradient
            gradientColors={['transparent', colors.WHITE]}
            onDragStateChange={(dragging) => setListScrollEnabled(!dragging)}
          />

        {/* 카테고리 칩 */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {CATEGORIES.map(cat => {
            const active = selectedCategory === cat;
            return (
              <TouchableOpacity key={cat} style={[styles.categoryBtn, active && styles.categoryBtnActive]}
                                onPress={() => setSelectedCategory(cat)}>
                <Text style={[styles.categoryText, active && styles.categoryTextActive]}>{cat}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </>
    ),[markedDates, selectedCategory, selectedDate]);

    if (isLoading) {
      return (
        <LinearGradient colors={['#EFFAFF', colors.WHITE]} start={{x:1,y:0}} end={{x:1,y:0.3}} style={styles.container}>
          <SafeAreaView style={[styles.content, {alignItems:'center', justifyContent:'center'}]}>
            <ActivityIndicator />
            <Text style={{marginTop:8, color: colors.GRAY_400}}>불러오는 중…</Text>
          </SafeAreaView>
        </LinearGradient>
      );
    }
    return (
      <LinearGradient colors={['#EFFAFF', colors.WHITE]} start={{x:1,y:0}} end={{x:1,y:0.3}} style={styles.container}>
        <SafeAreaView style={styles.content}>
          <FlatList
            data={listData}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => <PerformanceCard data={item} />}
            ListHeaderComponent={Header}
            contentContainerStyle={{ paddingBottom: 60 }}
            scrollEnabled={listScrollEnabled}
            ListEmptyComponent={
                isLoading ? (
                  <View style={{padding: 20, alignItems: 'center'}}>
                    <ActivityIndicator />
                    <Text style={{marginTop:8, color: colors.GRAY_400}}>불러오는 중…</Text>
                  </View>
                ) : (
                  <View style={{padding: 20}}>
                    <Text style={{color: colors.GRAY_400}}>선택한 조건에 해당하는 일정이 없어요.</Text>
                  </View>
                )
              }
          />
        </SafeAreaView>
      </LinearGradient>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
//     width: SCREEN_W,
  },
  content: {
    width: '100%',
    flex: 1,
  },
  header: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 9,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.LINE_GREY,
  },
  headerTitle: {
    flexDirection: 'row',
    gap: 6,
  },
  headerText: {
    fontFamily: 'Noto Sans KR',
    fontSize: 17,
    fontWeight: '500',
    letterSpacing: 0.1,
    lineHeight: 24,
    color: colors.GRAY_600,
  },
  categoryScroll: {
    paddingTop: 32,
    paddingHorizontal: 20,
    gap: 4,
    paddingBottom: 16,
  },
  categoryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: colors.GRAY_300,
    backgroundColor: colors.WHITE,
  },
  categoryBtnActive: {
    backgroundColor: colors.BLUE_500,
    borderWidth: 1,
    borderColor: colors.BLUE_500,
  },
  categoryText: {
    fontFamily: 'Noto Sans KR',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.2,
    lineHeight: 20,
    color: colors.GRAY_500,
  },
  categoryTextActive: {
    color: colors.WHITE,
  },
});

export default CalenderHomeScreen;
