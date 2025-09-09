import React from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {StyleSheet, Text, View} from 'react-native';

import {IntroStackParamList} from '@/navigations/stack/IntroStackNavigator';
import {introNavigations} from '@/constants';

type IntroScreenProps = StackScreenProps<
  IntroStackParamList,
  typeof introNavigations.INTRO_ONBOARDING_3
>;

function AuthHomeScreen({navigation}: IntroScreenProps) {
  return (
    <View style={styles.container}>
      <Text>INTRO_ONBOARDING_3</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AuthHomeScreen;
