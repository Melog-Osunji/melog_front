import React, {useState, useMemo} from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {StyleSheet, Text, View, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import {IntroStackParamList} from '@/navigations/stack/IntroStackNavigator';
import {introNavigations} from '@/constants';
import CustomButton from '@/components/common/CustomButton';
import {colors} from '@/constants';
import IndicatorProgressBar from '@/components/common/IndicatorProgressBar';
import Toast from '@/components/common/Toast';

type IntroScreenProps = StackScreenProps<
  IntroStackParamList,
  typeof introNavigations.INTRO_ONBOARDING_2
>;

const MAX = 1;
type GenreItem = { title: string; tag: string[] };
const DATA:GenreItem[] = Array.from({ length: 5 }).map((_, i) => ({
                           id: `genre-${i+1}`,
                           title: `텍스트 ${i+1}`,
                           tag: ['텍스트', '텍스트', '텍스트'],
                         }));

const { width: SCREEN_W } = Dimensions.get('window');

function Onboarding2Screen({navigation}: IntroScreenProps) {
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
        setSelected(prev => has ? prev.filter(v => v !== name) : [...prev, name]);
    };

    const renderItem = ({ item }: { item: GenreItem }) => {
        const on = selected.includes(item.title);
        return (
          <TouchableOpacity onPress={() => toggle(item.title)} style={[styles.card, on && styles.cardOn]} activeOpacity={0.9}>
              <Text style={[styles.cardTitle, on && styles.keywordTextActive]}>{item.title}</Text>
              <Text style={styles.cardDesc, on && styles.keywordTextActive }>
                {item.tag.join(', ')}
              </Text>
          </TouchableOpacity>
        );
    };

    const bottomBtnStyle = useMemo(
        () => [styles.primaryBtn, !canNext && { opacity: 0.6 }],
        [canNext]
    );

    return(
        <View style={styles.container}>
          <View style={styles.header}>
            <IndicatorProgressBar step={2} total={3} />
          </View>
          <Text style={styles.title}>취향에 맞는{'\n'}<Text style={styles.activeText}>장르</Text>를 알려주세요.</Text>
          <Text style={styles.caption}>최대 {MAX}개까지 선택할 수 있어요.</Text>
          <FlatList
              data={DATA}
              keyExtractor={(i) => i}
              renderItem={renderItem}
              contentContainerStyle={{ gap: 12, paddingBottom: 12 }}
          />
          <View style={styles.bottom}>
              <TouchableOpacity
                style={bottomBtnStyle}
                disabled={!canNext}
                onPress={() => navigation.navigate(introNavigations.INTRO_ONBOARDING_3)}
                activeOpacity={0.9}
              >
                <Text style={styles.primaryTxt}>다음</Text>
              </TouchableOpacity>
              <Text style={styles.skip} onPress={() => navigation.navigate(introNavigations.INTRO_ONBOARDING_2)}>건너뛰기</Text>
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
  card: {
    width: SCREEN_W -40,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.GRAY_100,
    justifyContent: 'center',
    gap: 4,
    borderRadius:8,
  },
  cardOn: {
    backgroundColor: colors.BLUE_300,
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
    paddingTop: 6,
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

export default Onboarding2Screen;
