import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {SettingStackParamList} from '@/navigations/stack/SettingStackNavigator';
import {settingsNavigations, colors} from '@/constants';
import IconButton from '@/components/common/IconButton';
import {useNotices} from '@/hooks/queries/settings/useSettingsQueries';
import {NavigationContainer} from '@react-navigation/native';

type NoticesPageScreenProps = StackScreenProps<
  SettingStackParamList,
  typeof settingsNavigations.NOTICES_PAGE
>;

export default function NoticesPageScreen({
  route,
  navigation,
}: NoticesPageScreenProps) {
  const {notice} = route.params;
  const {data} = useNotices();

  // 날짜 포맷팅 (예: 2025.09.19)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  // 현재 공지사항의 인덱스 찾기
  const notices = data?.notices ?? [];
  const currentIndex = notices.findIndex(n => n.id === notice.id);

  // 이전/다음 공지사항
  const prevNotice = currentIndex > 0 ? notices[currentIndex - 1] : null;
  const nextNotice =
    currentIndex < notices.length - 1 ? notices[currentIndex + 1] : null;

  const handleNavigate = (targetNotice: typeof notice) => {
    navigation.replace(settingsNavigations.NOTICES_PAGE, {
      notice: targetNotice,
    });
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <IconButton
          imageSource={require('@/assets/icons/post/BackArrow.png')}
          target={'goBack'}
          size={24}
        />
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.contentContainer}>
        <View style={styles.noticeContainer}>
          <Text style={styles.title}>{notice.title}</Text>
          <Text style={styles.date}>{formatDate(notice.createdAt)}</Text>
          <View style={styles.divider} />
          <Text style={styles.content}>{notice.content}</Text>
        </View>

        {/* 이전/다음 네비게이션 */}
        <View style={styles.NavigationContainer}>
          {prevNotice && (
            <TouchableOpacity
              style={styles.navItem}
              onPress={() => handleNavigate(prevNotice)}
              activeOpacity={0.7}>
              <Text style={styles.navLabel}>이전</Text>
              <Text style={styles.navTitle}>{prevNotice.title}</Text>
            </TouchableOpacity>
          )}
          {nextNotice && (
            <TouchableOpacity
              style={styles.navItem}
              onPress={() => handleNavigate(nextNotice)}
              activeOpacity={0.7}>
              <Text style={styles.navLabel}>다음</Text>
              <Text style={styles.navTitle}>{nextNotice.title}</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  body: {
    flex: 1,
  },
  contentContainer: {backgroundColor: colors.GRAY_100, gap: 12},
  noticeContainer: {
    backgroundColor: colors.WHITE,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.BLACK,
    marginBottom: 12,
    lineHeight: 32,
  },
  date: {
    fontSize: 14,
    color: colors.GRAY_300,
    marginBottom: 24,
  },
  divider: {
    height: 1,
    backgroundColor: colors.GRAY_100,
    marginBottom: 24,
  },
  content: {
    fontSize: 16,
    color: colors.BLACK,
    lineHeight: 28,
    marginBottom: 20,
  },
  NavigationContainer: {backgroundColor: colors.WHITE},
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 20,
  },
  navLabel: {
    fontSize: 14,
    color: colors.GRAY_300,
  },
  navTitle: {
    fontSize: 14,
    color: colors.GRAY_500,
  },
});
