import React from 'react';
import {StyleSheet} from 'react-native';
import {
  createStackNavigator,
  CardStyleInterpolators,
  TransitionSpecs,
} from '@react-navigation/stack';
import {introNavigations} from '@/constants';
//screens
import WelcomeScreen from '@/screens/intro/WelcomeScreen';
import PreOnboardingScreen from '@/screens/intro/PreOnboardingScreen';
import LoginScreen from '@/screens/intro/LoginScreen';

export type IntroStackParamList = {
  [introNavigations.INTRO_LOGIN]: undefined;
  [introNavigations.INTRO_WELCOME]: undefined;

  [introNavigations.PRE_ONBOARDING]: {onDone?: () => void} | undefined;
  [introNavigations.INTRO_ONBOARDING_1]: {onDone?: () => void} | undefined;
  [introNavigations.INTRO_ONBOARDING_2]: {onDone?: () => void} | undefined;
  [introNavigations.INTRO_ONBOARDING_3]: {onDone?: () => void} | undefined;

  [introNavigations.TOS_CONSENTLIST]: undefined;
  [introNavigations.TOS_AGREEMENT_VIEWER]: {docId: string};

  [introNavigations.INTRO_PROFILE]: undefined;
};

const Stack = createStackNavigator<IntroStackParamList>();

type Props = {onDone?: () => void};

function AuthStackNavigator({onDone}: Props) {
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyle: {backgroundColor: '#fff'},
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        // ★ 슬라이드 애니메이션 핵심
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        transitionSpec: {
          open: TransitionSpecs.TransitionIOSSpec, // duration 300ms 정도
          close: TransitionSpecs.TransitionIOSSpec,
        },
      }}>
      {/* 스플래쉬 */}
      <Stack.Screen
        name={introNavigations.INTRO_WELCOME}
        component={WelcomeScreen}
        options={{
          headerTitle: ' ',
          headerShown: false,
        }}
      />
      {/* 시작전온보딩 */}
      <Stack.Screen
        name={introNavigations.PRE_ONBOARDING}
        component={PreOnboardingScreen}
        options={{
          headerTitle: '',
        }}
        initialParams={{onDone}}
      />
      {/* 로그인 */}
      <Stack.Screen
        name={introNavigations.INTRO_LOGIN}
        component={LoginScreen}
        options={{
          headerTitle: ' ',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});

export default AuthStackNavigator;
