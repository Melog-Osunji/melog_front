import {StackScreenProps} from '@react-navigation/stack';
import React, {useMemo, useRef, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Alert,
} from 'react-native';
import {IntroStackParamList} from '@/navigations/stack/IntroStackNavigator';
import {introNavigations} from '@/constants';
import CustomButton from '@/components/common/CustomButton';
import {colors} from '@/constants';

type PreOnboardingRouteParams = {onDone?: () => void} | undefined;

type IntroScreenProps = StackScreenProps<
  IntroStackParamList,
  typeof introNavigations.INTRO_LOGIN,
  any
> & {route: {params?: PreOnboardingRouteParams}};

const {width: SCREEN_W} = Dimensions.get('window');

type Page = {title: string; caption: string};
const PAGES: Page[] = [
  {
    title: '클래식 멜로디 속에 나의\n감상을 담는 공간, Melog',
    caption: '피드 내리다가 좋아요 누르는 영상',
  },
  {
    title: '감상한 클래식을\n쉽게 찾고 기록할 수 있어요',
    caption: '글쓰기 화면 내 음악 찾기에서 영상 추가하는 영상',
  },
  {
    title: '취향이 맞는 사람들과 모여\n감상을 나눌 수 있어요',
    caption: '하모니룸 메인 화면에서 세부 화면으로 이동하는 영상',
  },
];

function PreOnboardingScreen({navigation, route}: IntroScreenProps) {
  const onDone = route?.params?.onDone;
  const listRef = useRef<FlatList<Page>>(null);
  const [index, setIndex] = useState(0);

  const isLast = index === PAGES.length - 1;
  const primaryLabel = isLast ? '시작하기' : '다음';

  // 다음 버튼 함수
  const goNext = () => {
    if (isLast) {
      if (onDone) return onDone();
      navigation.navigate(introNavigations.INTRO_LOGIN);
      return;
    }
    const next = index + 1;
    listRef.current?.scrollToOffset({offset: next * SCREEN_W, animated: true});
    setIndex(next);
  };

  // 건너뛰기 함수
  const onSkip = () => {
    if (onDone) return onDone();
    navigation.navigate(introNavigations.INTRO_LOGIN);
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const next = Math.round(x / SCREEN_W);
    if (next !== index) setIndex(next);
  };

  const renderItem = ({item}: ListRenderItemInfo<Page>) => {
    return (
      <View style={[styles.page, {width: SCREEN_W}]}>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>{item.title}</Text>
        </View>
        <View style={styles.captionWrap}>
          <Text style={styles.caption}>{item.caption}</Text>
        </View>
      </View>
    );
  };

  const pagination = useMemo(
    () => (
      <View style={styles.dots}>
        {PAGES.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor:
                  i === index ? colors.DOT_ACTIVE : colors.DOT_DEFAULT,
              },
            ]}
          />
        ))}
      </View>
    ),
    [index],
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        data={PAGES}
        keyExtractor={(_, i) => `page-${i}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        onScroll={onScroll}
        scrollEventThrottle={16}
      />

      <View style={styles.bottom}>
        {pagination}

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={goNext}
          activeOpacity={0.9}>
          <Text style={styles.primaryTxt}>{primaryLabel}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onSkip}
          hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Text style={styles.skip}>건너뛰기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  page: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: {
    marginTop: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.GRAY_600,
    lineHeight: 32,
    fontFamily: 'Noto Sans KR',
    textAlign: 'center',
  },
  captionWrap: {
    marginTop: 24,
    width: SCREEN_W * 0.8,
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.GRAY_100,
    marginBottom: 24,
  },
  caption: {
    color: colors.GRAY_400,
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 32,
    fontFamily: 'Noto Sans KR',
  },
  bottom: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  dots: {
    flexDirection: 'row',
    alignSelf: 'center',
    gap: 6,
    marginBottom: 36,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 5,
  },
  primaryBtn: {
    width: SCREEN_W - 40,
    height: 52,
    borderRadius: 8,
    backgroundColor: colors.BLUE_400,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryTxt: {
    color: colors.WHITE,
    fontWeight: '700',
    fontSize: 15,
    lineHeight: 32,
    letterSpacing: 0.25,
    fontFamily: 'Noto Sans KR',
  },
  skip: {
    marginTop: 13,
    textAlign: 'center',
    color: colors.GRAY_400,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.2,
    fontFamily: 'Noto Sans KR',
  },
});

export default PreOnboardingScreen;
