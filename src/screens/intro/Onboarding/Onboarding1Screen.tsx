import React, {useState, useMemo} from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {StyleSheet, Text, View, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import {IntroStackParamList} from '@/navigations/stack/IntroStackNavigator';
import {introNavigations} from '@/constants';
import CustomButton from '@/components/common/CustomButton';
import {colors} from '@/constants';
import IndicatorProgressBar from '@/components/common/IndicatorProgressBar';
import Toast, {ToastType} from '@/components/common/Toast';

type IntroScreenProps = StackScreenProps<
  IntroStackParamList,
  typeof introNavigations.INTRO_ONBOARDING_1
>;

const MAX = 3;
const DATA = ['바흐','모차르트','베토벤','브람스','슈만','멘델스존','차이콥스키','비발디', '드뷔시', '김택수', '스트라빈스키', '사리아호'];
const { width: SCREEN_W } = Dimensions.get('window');

function Onboarding1Screen({navigation, route}: IntroScreenProps) {
    const [selected, setSelected] = useState<string[]>([]);
    const canNext = selected.length > 0;

    // 토스트 상태
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<ToastType>('none');
    const [toastOffSet, setToastOffSet] = useState(0);

    const showToast = (message: string, type: ToastType = 'error', offset: number) => {
        setToastMessage(message);
        setToastType(type);
        setToastOffSet(offset)
        setToastVisible(true);
    };

    const hideToast = () => {
        setToastVisible(false);
    };

    const toggle = (name: string) => {
        const has = selected.includes(name);
        if (!has && selected.length >= MAX) {
            showToast(`최대 ${MAX}개까지 선택할 수 있어요`, 'middleError', 24);
            return;
        }
        setSelected(prev => has ? prev.filter(v => v !== name) : [...prev, name]);
    };


    const renderItem = ({ item }: { item: string }) => {
        const on = selected.includes(item);
        return (
          <TouchableOpacity onPress={() => toggle(item)} style={[styles.chip, on && styles.chipOn]}>
            <View style={styles.circle} />
            <Text style={[styles.keywordText, on && styles.keywordTextActive]}>{item}</Text>
          </TouchableOpacity>
        );
    };

    const bottomBtnStyle = useMemo(
        () => [styles.primaryBtn, !canNext && { opacity: 0.6 }],
        [canNext]
      );

    return (
        <View style={styles.container}>
          <View style={styles.header}>
            <IndicatorProgressBar step={1} total={3} />
          </View>
          <Text style={styles.title}>어떤 <Text style={styles.activeText}>작곡가</Text>의{'\n'}곡을 선호하시나요?</Text>
          <Text style={styles.caption}>최대 {MAX}개까지 선택할 수 있어요.</Text>
          <FlatList
              data={DATA}
              keyExtractor={(i) => i}
              renderItem={renderItem}
              numColumns={2}
              columnWrapperStyle={{ gap: 12 }}
              contentContainerStyle={{ gap: 12, paddingBottom: 12 }}
          />
          <View style={styles.bottom}>
              <CustomButton
                label="다음"
                inValid={!canNext}
                onPress={() => {
                    navigation.navigate(introNavigations.INTRO_ONBOARDING_2);
                }}
                style={{backgroundColor: colors.BLUE_500}}
              />
              <Text style={styles.skip} onPress={() => navigation.navigate(introNavigations.INTRO_ONBOARDING_2)}>건너뛰기</Text>
          </View>

          <Toast
              message={toastMessage}
              visible={toastVisible}
              type={toastType}
              position="onTop"
              onHide={hideToast}
              offset={toastOffSet}
            />
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  // 프로그레스바
  header: {
    marginBottom: 25,
  },
  // 타이틀
  title: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 30,
    letterSpacing: 0.1,
    color: colors.GRAY_600,
    marginBottom:8,
  },
  activeText: {
    color: colors.BLUE_500,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: 0.2,
    color: colors.GRAY_400,
    marginBottom:30,
  },
  // 선택 칩
  chip: {
    paddingTop: 8,
    paddingRight: 16,
    paddingBottom: 8,
    paddingLeft: 8,
    backgroundColor: colors.GRAY_100,
    borderRadius: 60,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipOn: {
    backgroundColor: colors.BLUE_300,
  },
  circle: {
      width: 32,
      height: 32,
      backgroundColor: colors.DOT_DEFAULT,
      borderRadius: 100,
  },
  keywordText: {
      fontSize: 15,
      color: colors.GRAY_400,
  },
  keywordTextActive: {
      color: colors.BLUE_500,
  },
  // 하단
  bottom: {
    marginTop: 'auto',
    paddingBottom: 24,
    gap: 16
  },
  primaryBtn:{
    width: SCREEN_W - 40,
    height: 52,
    backgroundColor: colors.BLUE_400,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryTxt: {
    color: colors.WHITE,
    fontWeight: '700',
    fontSize: 15,
    lineHeight:32,
    letterSpacing: 0.25,
    fontFamily: 'Noto Sans KR'
  },
  skip: {
    textAlign: 'center',
    color: colors.GRAY_400,
    fontSize: 12,
    lineHeight:16,
    letterSpacing:0.2,
    fontFamily: 'Noto Sans KR'
  },
});

export default Onboarding1Screen;
