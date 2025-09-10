import React from 'react';
import {StyleSheet} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';

import WelcomeScreen from '@/screens/intro/WelcomeScreen';
import PreOnboardingScreen from '@/screens/intro/PreOnboardingScreen';
// import Onboarding2Screen from '@/screens/intro/Onboarding2Screen';
// import Onboarding3Screen from '@/screens/intro/Onboarding3Screen';

import {introNavigations} from '@/constants';

export type IntroStackParamList = {
  [introNavigations.INTRO_WELCOME]: undefined;
  [introNavigations.PRE_ONBOARDING]: {onDone?: () => void } | undefined;
//   [introNavigations.INTRO_ONBOARDING_2]: undefined;
//   [introNavigations.INTRO_ONBOARDING_3]: undefined;
};

const Stack = createStackNavigator<IntroStackParamList>();

type Props = { onDone?: () => void };


function AuthStackNavigator({onDone}:Props) {
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyle: {backgroundColor: '#fff'},
      }}>
      <Stack.Screen
        name={introNavigations.INTRO_WELCOME}
        component={WelcomeScreen}
        options={{
          headerTitle: ' ',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={introNavigations.PRE_ONBOARDING}
        component={PreOnboardingScreen}
        options={{
          headerTitle: '',
        }}
        initialParams = {{onDone}}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});

export default AuthStackNavigator;
