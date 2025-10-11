import React, {useState, useMemo} from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {IntroStackParamList} from '@/navigations/stack/IntroStackNavigator';
import {introNavigations} from '@/constants';
import CustomButton from '@/components/common/CustomButton';
import {colors} from '@/constants';
import IndicatorProgressBar from '@/components/common/IndicatorProgressBar';
import Toast from '@/components/common/Toast';
import {useAuthContext} from '@/contexts/AuthContext';

type IntroScreenProps = StackScreenProps<
  IntroStackParamList,
  typeof introNavigations.INTRO_ONBOARDING_3
>;

const MAX = 3;
const DATA = [
  '텍스트1',
  '텍스트2',
  '텍스트3',
  '텍스트4',
  '텍스트5',
  '텍스트6',
  '텍스트7',
  '텍스트8',
  '텍스트9',
];

const {width: SCREEN_W} = Dimensions.get('window');

function Onboarding3Screen({navigation, route}: IntroScreenProps) {
  const {setIsLogin, completeRegistration} = useAuthContext();

  const [selected, setSelected] = useState<string[]>([]);
  const canNext = selected.length > 0;

  // 토스트 상태
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
  };

  const toggle = (name: string) => {
    const has = selected.includes(name);
    if (!has && selected.length >= MAX) {
      showToast(`최대 ${MAX}개까지 선택할 수 있어요`);
      return;
    }
    setSelected(prev => (has ? prev.filter(v => v !== name) : [...prev, name]));
  };

  const renderItem = ({item}: {item: string}) => {
    const on = selected.includes(item);
    return (
      <TouchableOpacity onPress={() => toggle(item)} style={styles.chip}>
        <View style={[styles.circle, on && styles.chipOn]} />
        <Text style={[styles.keywordText, on && styles.keywordTextActive]}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  const bottomBtnStyle = useMemo(
    () => [styles.primaryBtn, !canNext && {opacity: 0.6}],
    [canNext],
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IndicatorProgressBar step={3} total={3} />
      </View>
      <Text style={styles.title}>
        즐겨듣는{'\n'}
        <Text style={styles.activeText}>악기</Text>를 알려주세요.
      </Text>
      <Text style={styles.caption}>최대 {MAX}개까지 선택할 수 있어요.</Text>
      <FlatList
        data={DATA}
        keyExtractor={i => i}
        renderItem={renderItem}
        numColumns={3}
        columnWrapperStyle={{gap: 16}}
        contentContainerStyle={{
          gap: 12,
          paddingBottom: 12,
          alignItems: 'center',
        }}
      />
      <View style={styles.bottom}>
        <CustomButton
          label="다음"
          inValid={!canNext}
          onPress={() => {
            setIsLogin(true);
            completeRegistration();
          }}
        />
        <Text
          style={styles.skip}
          onPress={() => {
            setIsLogin(true);
            completeRegistration();
          }}>
          건너뛰기
        </Text>
      </View>
      <Toast
        message={toastMessage}
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
        duration={2000}
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
    marginBottom: 8,
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
    marginBottom: 30,
  },
  // 선택 칩
  chip: {
    flexDirection: 'column',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: (SCREEN_W - 80) / 3,
    height: (SCREEN_W - 80) / 3,
    backgroundColor: colors.WHITE,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.GRAY_200,
  },
  chipOn: {
    borderColor: colors.BLUE_400,
    backgroundColor: colors.BLUE_200,
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
    gap: 16,
  },
  primaryBtn: {
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
    lineHeight: 32,
    letterSpacing: 0.25,
    fontFamily: 'Noto Sans KR',
  },
  skip: {
    textAlign: 'center',
    color: colors.GRAY_400,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.2,
    fontFamily: 'Noto Sans KR',
  },
});

export default Onboarding3Screen;
