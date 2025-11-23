// src/screens/ConsentList.tsx
import React, {useState, useEffect, useRef} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
//navigator
import {StackScreenProps} from '@react-navigation/stack';
import {IntroStackParamList} from '@/navigations/stack/IntroStackNavigator';
import {introNavigations} from '@/constants';
//constants
import {colors} from '@/constants';
import {AGREEMENTS} from '@/constants/agreements';
//components
import IconButton from '@/components/common/IconButton';
import {useAgreeToTerms} from '@/hooks/queries/User/useUserMutations';
import {showToast} from '@/components/common/ToastService';

type ConsentListProps = StackScreenProps<
  IntroStackParamList,
  typeof introNavigations.INTRO_PROFILE,
  typeof introNavigations.TOS_AGREEMENT_VIEWER
>;

export default function ConsentList({navigation}: ConsentListProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const navigatedRef = useRef(false);

  const toggle = (id: string, val: boolean) => {
    setChecked(prev => ({...prev, [id]: val}));
  };

  const allRequiredAgreed = AGREEMENTS.every(a => checked[a.id]);
  const agreeMutation = useAgreeToTerms();

  useEffect(() => {
    if (allRequiredAgreed && !navigatedRef.current) {
      navigatedRef.current = true;
      const marketing = !!checked['marketing'];
      console.log('[ConsentList.tsx] all agreed -> submit agreements', {
        marketing,
      });
      agreeMutation.mutate(marketing, {
        onSuccess: () => {
          console.log('[ConsentList.tsx] agreements submitted, navigate');
          navigation.navigate(introNavigations.INTRO_PROFILE);
        },
        onError: err => {
          console.error('[ConsentList.tsx] submit agreements failed:', err);
          showToast('약관 동의에 실패했습니다.', 'error', 'top', 30);
          navigation.navigate(introNavigations.INTRO_PROFILE);
        },
      });
    }
  }, [allRequiredAgreed, navigation, agreeMutation]);

  return (
    <View style={styles.container}>
      <IconButton
        imageSource={require('@/assets/icons/common/BackArrow.png')}
        target={'goBack'}
        size={24}
      />
      {/*title*/}
      <Text style={styles.title}>
        <Text style={{color: colors.BLUE_400}}>Melog</Text>와 함께하기 위해{' '}
        {'\n'}이용약관 동의가 필요해요.
      </Text>

      {/*동의 리스트*/}
      <View style={styles.toswrapper}>
        <View style={styles.tos_item}>
          <TouchableOpacity
            onPress={() => {
              const newChecked: Record<string, boolean> = {};
              AGREEMENTS.forEach(a => {
                newChecked[a.id] = !allRequiredAgreed;
              });
              setChecked(newChecked);
            }}>
            <Image
              source={
                AGREEMENTS.every(a => checked[a.id])
                  ? require('@/assets/icons/intro/checkbox_activate.png')
                  : require('@/assets/icons/intro/checkbox.png')
              }
              style={{
                width: 24,
                height: 24,
              }}
            />
          </TouchableOpacity>

          <View>
            <Text style={styles.total_text_h1}>모두 동의</Text>
            <Text style={styles.total_text_h2}>
              약관 및 개인정보 보호방침, 마케팅 수신에 동의합니다.
            </Text>
          </View>
        </View>
        <View
          style={{
            height: 1,
            backgroundColor: colors.GRAY_200,
            marginVertical: 8,
          }}
        />
        {AGREEMENTS.map(item => (
          <View key={item.id} style={styles.tos_item_wrapper}>
            <View style={styles.tos_item}>
              <TouchableOpacity
                onPress={() => toggle(item.id, !checked[item.id])}>
                <Image
                  source={
                    checked[item.id]
                      ? require('@/assets/icons/intro/checkbox_activate.png')
                      : require('@/assets/icons/intro/checkbox.png')
                  }
                  style={{
                    width: 24,
                    height: 24,
                  }}
                />
              </TouchableOpacity>

              <Text>
                <Text style={styles.tos_item_text}>
                  <Text style={{color: colors.BLUE_400}}>
                    {item.required ? '(필수) ' : '(선택) '}
                  </Text>
                  {item.title}
                </Text>
              </Text>
            </View>

            {item.isFile && (
              <IconButton
                imageSource={require('@/assets/icons/common/RightArrow.png')}
                target={[
                  introNavigations.TOS_AGREEMENT_VIEWER,
                  {docId: item.id},
                ]}
                size={24}
              />
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.WHITE,
    gap: 50,
  },
  title: {fontSize: 22, fontWeight: 'bold', color: colors.BLACK},
  toswrapper: {marginTop: 30},
  tos_item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    gap: 8,
  },
  total_text_h1: {
    fontSize: 15,
    color: colors.BLACK,
    fontWeight: 'bold',
    lineHeight: 22,
  },
  total_text_h2: {fontSize: 12, color: colors.GRAY_350, lineHeight: 22},
  tos_item_text: {fontSize: 15, color: colors.BLACK},
  tos_item_wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
