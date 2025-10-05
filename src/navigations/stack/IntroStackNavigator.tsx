import React from 'react';
import {StyleSheet} from 'react-native';
import {
  createStackNavigator,
  CardStyleInterpolators,
  TransitionSpecs,
} from '@react-navigation/stack';

import WelcomeScreen from '@/screens/intro/WelcomeScreen';
import PreOnboardingScreen from '@/screens/intro/PreOnboardingScreen';
import Onboarding1Screen from '@/screens/intro/Onboarding/Onboarding1Screen';
import Onboarding2Screen from '@/screens/intro/Onboarding/Onboarding2Screen';
import Onboarding3Screen from '@/screens/intro/Onboarding/Onboarding3Screen';
import {introNavigations} from '@/constants';

import LoginScreen from '@/screens/intro/LoginScreen';
import ConsentList from '@/screens/intro/ToS/ConsentList';
import AgreementViewer from '@/screens/intro/ToS/AgreementViewer';
import InitProfileStackNavigator from '@/navigations/stack/InitProfileStackNavigator';

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
      {/* 이용약관 */}
      <Stack.Screen
        name={introNavigations.TOS_CONSENTLIST}
        component={ConsentList}
        options={{
          headerTitle: ' ',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={introNavigations.TOS_AGREEMENT_VIEWER}
        component={AgreementViewer}
        options={{
          headerTitle: ' ',
          headerShown: false,
        }}
      />
      {/* 최초프로필설정 */}
      <Stack.Screen
        name={introNavigations.INTRO_PROFILE}
        component={InitProfileStackNavigator}
        options={{
          headerShown: false,
        }}
      />

      {/* 맞춤형온보딩 */}
      <Stack.Screen
        name={introNavigations.INTRO_ONBOARDING_1}
        component={Onboarding1Screen}
        options={{
          headerTitle: '',
        }}
        initialParams={{onDone}}
      />
      <Stack.Screen
        name={introNavigations.INTRO_ONBOARDING_2}
        component={Onboarding2Screen}
        options={{
          headerTitle: '',
        }}
        initialParams={{onDone}}
      />
      <Stack.Screen
        name={introNavigations.INTRO_ONBOARDING_3}
        component={Onboarding3Screen}
        options={{
          headerTitle: '',
        }}
        initialParams={{onDone}}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});

export default AuthStackNavigator;
