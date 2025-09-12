import React from 'react';
import {StyleSheet} from 'react-native';
import {createStackNavigator, CardStyleInterpolators, TransitionSpecs} from '@react-navigation/stack';

import WelcomeScreen from '@/screens/intro/WelcomeScreen';
import PreOnboardingScreen from '@/screens/intro/PreOnboardingScreen';
import Onboarding1Screen from '@/screens/intro/Onboarding1Screen'
import Onboarding2Screen from '@/screens/intro/Onboarding2Screen';
import Onboarding3Screen from '@/screens/intro/Onboarding3Screen';

import {introNavigations} from '@/constants';

export type IntroStackParamList = {
  [introNavigations.INTRO_WELCOME]: undefined;
  [introNavigations.PRE_ONBOARDING]: {onDone?: () => void } | undefined;
  [introNavigations.INTRO_ONBOARDING_1]: {onDone?: () => void } | undefined;
  [introNavigations.INTRO_ONBOARDING_2]: {onDone?: () => void } | undefined;
  [introNavigations.INTRO_ONBOARDING_3]: {onDone?: () => void } | undefined;
};

const Stack = createStackNavigator<IntroStackParamList>();

type Props = { onDone?: () => void };


function AuthStackNavigator({onDone}:Props) {
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyle: {backgroundColor: '#fff'},
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        // ★ 슬라이드 애니메이션 핵심
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        transitionSpec: {
          open: TransitionSpecs.TransitionIOSSpec,   // duration 300ms 정도
          close: TransitionSpecs.TransitionIOSSpec,
        },
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
      <Stack.Screen
        name={introNavigations.INTRO_ONBOARDING_1}
        component={Onboarding1Screen}
        options={{
          headerTitle: '',
        }}
        initialParams = {{onDone}}
      />
      <Stack.Screen
        name={introNavigations.INTRO_ONBOARDING_2}
        component={Onboarding2Screen}
        options={{
          headerTitle: '',
        }}
        initialParams = {{onDone}}
      />
      <Stack.Screen
        name={introNavigations.INTRO_ONBOARDING_3}
        component={Onboarding3Screen}
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
