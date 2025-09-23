import React, {useState} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Dimensions, FlatList} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '@/constants';
import IconButton from '@/components/common/IconButton';
import PerformanceCard from '@/components/calender/PerformanceCard';
import { PerformanceData } from '@/constants/dummyData';
import CalendarTopSheet from '@/components/calender/CalendarTopSheet';

const SCREEN_W = Dimensions.get('window').width;

const CATEGORIES = ['전체', '공연', '전시', '강연', '축제', '토크'];

function CalenderHomeScreen() {

  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedDate, setSelectedDate] = useState(null);

  const filteredData =
      selectedCategory === '전체'
        ? PerformanceData
        : PerformanceData.filter(p => p.category === selectedCategory);

  const bookmarked = PerformanceData.filter(p => p.isBookmark);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    // 선택된 날짜의 공연만 보여주거나 다른 로직 실행
    console.log('Selected date:', date);
  };

  // 헤더(앱바) + 탑시트 + 카테고리
    const Header = (
      <>
        <View style={styles.header}>
          <View style={styles.headerTitle}>
            <Image source={require('@/assets/icons/calender/CalenderLogo.png')} style={styles.headerImg}/>
            <Text style={styles.headerText}>캘린더</Text>
          </View>
          <IconButton imageSource={require('@/assets/icons/post/Notice.png')} />
        </View>

        {/* ⬇️ 여기서 탑시트 */}
        <CalendarTopSheet
          performanceData={bookmarked}
          onDateSelect={(d) => setSelectedDate(d)}
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
    );

    return (
      <LinearGradient colors={['#EFFAFF', colors.WHITE]} start={{x:1,y:0}} end={{x:1,y:0.3}} style={styles.container}>
        <SafeAreaView style={styles.content}>
          <FlatList
            data={filteredData}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => <PerformanceCard data={item} />}
            ListHeaderComponent={Header}
            contentContainerStyle={{ paddingBottom: 60 }}
          />
        </SafeAreaView>
      </LinearGradient>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: SCREEN_W,
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
  },
  categoryBtn: {
    height: 36,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: colors.GRAY_300,
    backgroundColor: colors.WHITE,
  },
  categoryBtnActive: {
    backgroundColor: colors.BLUE_500,
    borderWidth: 0,
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
