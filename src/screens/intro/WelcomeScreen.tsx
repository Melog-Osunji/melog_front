import React from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {StyleSheet, Text, View} from 'react-native';

import {IntroStackParamList} from '@/navigations/stack/IntroStackNavigator';
import {introNavigations} from '@/constants';
import CustomButton from '@/components/CustomButton';

type IntroScreenProps = StackScreenProps<
  IntroStackParamList,
  typeof introNavigations.INTRO_WELCOME
>;

function AuthHomeScreen({navigation}: IntroScreenProps) {
  return (
    <View style={styles.container}>
      <Text>welcome page</Text>
      <CustomButton
        label="다음"
        onPress={() => navigation.navigate(introNavigations.INTRO_ONBOARDING_1)}
        size="medium"
      />
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
