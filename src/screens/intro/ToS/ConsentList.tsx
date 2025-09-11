// src/screens/ConsentList.tsx
import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';

import {colors} from '@/constants';
import CustomButton from '@/components/common/CustomButton';
import {AGREEMENTS} from '@/types/agreements';
import {IntroStackParamList} from '@/navigations/stack/IntroStackNavigator';
import {introNavigations} from '@/constants';

type ConsentListProps = StackScreenProps<
  IntroStackParamList,
  typeof introNavigations.INTRO_PROFILE,
  typeof introNavigations.TOS_AGREEMENT_VIEWER
>;

export default function ConsentList({navigation}: ConsentListProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (id: string, val: boolean) => {
    setChecked(prev => ({...prev, [id]: val}));
  };

  const allRequiredAgreed = AGREEMENTS.every(a => checked[a.id]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        <Text style={{color: colors.BLUE_400}}>Melog</Text>와 함께하기 위해{' '}
        {'\n'}이용약관 동의가 필요해요.
      </Text>
      <View style={styles.toswrapper}>
        <View style={styles.total}>
          <Text style={styles.total_text}>전체동의</Text>
          <TouchableOpacity
            onPress={() => {
              const newChecked: Record<string, boolean> = {};
              AGREEMENTS.forEach(a => {
                newChecked[a.id] = !allRequiredAgreed;
              });
              setChecked(newChecked);
            }}>
            <Image
              source={require('@/assets/icons/intro/check_circle.png')}
              style={{
                width: 24,
                height: 24,
                tintColor: AGREEMENTS.every(a => checked[a.id])
                  ? colors.BLUE_500
                  : colors.GRAY_300,
              }}
            />
          </TouchableOpacity>
        </View>
        {AGREEMENTS.map(item => (
          <View key={item.id} style={styles.tos_item}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(introNavigations.TOS_AGREEMENT_VIEWER, {
                  docId: item.id,
                });
                console.log(item.id);
              }}>
              <Text>
                {item.required ? (
                  <Text style={{textDecorationLine: 'underline'}}>
                    {item.title}
                  </Text>
                ) : (
                  item.title
                )}{' '}
                {item.required ? '(필수)' : '(선택)'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => toggle(item.id, !checked[item.id])}>
              <Image
                source={require('@/assets/icons/intro/check_circle.png')}
                style={{
                  width: 24,
                  height: 24,
                  tintColor: checked[item.id]
                    ? colors.BLUE_500
                    : colors.GRAY_300,
                }}
              />
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <CustomButton
        label="다음"
        style={{position: 'absolute', bottom: 30, left: 24, right: 24}}
        onPress={() => navigation.navigate(introNavigations.INTRO_PROFILE)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    padding: 20,
    backgroundColor: colors.WHITE,
    justifyContent: 'center',
    gap: 50,
  },
  toswrapper: {marginBottom: 40},
  total: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: colors.GRAY_100,
    borderRadius: 4,
    marginBottom: 16,
  },
  total_text: {fontSize: 18, color: colors.BLUE_500},
  tos_item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  title: {fontSize: 22, fontWeight: 'bold', color: colors.BLACK},
  link: {color: '#007AFF', fontSize: 14},
});
