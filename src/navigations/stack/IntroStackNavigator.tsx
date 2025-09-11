import React from 'react';
import {StyleSheet} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {introNavigations} from '@/constants';

import WelcomeScreen from '@/screens/intro/WelcomeScreen';
import LoginScreen from '@/screens/intro/LoginSreen';
import ConsentList from '@/screens/intro/ToS/ConsentList';
import AgreementViewer from '@/screens/intro/ToS/AgreementViewer';
import Onboarding1Screen from '@/screens/intro/Onboarding/Onboarding1Screen';
import Onboarding2Screen from '@/screens/intro/Onboarding/Onboarding2Screen';
import Onboarding3Screen from '@/screens/intro/Onboarding/Onboarding3Screen';
import InitProfileStackNavigator from '@/navigations/stack/InitProfileStackNavigator';

export type IntroStackParamList = {
  [introNavigations.INTRO_LOGIN]: undefined;
  [introNavigations.INTRO_WELCOME]: undefined;
  [introNavigations.TOS_CONSENTLIST]: undefined;
  [introNavigations.TOS_AGREEMENT_VIEWER]: undefined;
  [introNavigations.INTRO_ONBOARDING_1]: undefined;
  [introNavigations.INTRO_ONBOARDING_2]: undefined;
  [introNavigations.INTRO_ONBOARDING_3]: undefined;
  [introNavigations.INTRO_PROFILE]: undefined;
};

const Stack = createStackNavigator<IntroStackParamList>();

function AuthStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyle: {backgroundColor: '#fff'},
      }}>
      {/* 로그인 */}
      <Stack.Screen
        name={introNavigations.INTRO_LOGIN}
        component={LoginScreen}
        options={{
          headerTitle: ' ',
          headerShown: false,
        }}
      />
      {/* 스플래쉬 */}
      <Stack.Screen
        name={introNavigations.INTRO_WELCOME}
        component={WelcomeScreen}
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
      {/* 온보딩 */}
      <Stack.Screen
        name={introNavigations.INTRO_ONBOARDING_1}
        component={Onboarding1Screen}
        options={{
          headerTitle: '',
        }}
      />
      <Stack.Screen
        name={introNavigations.INTRO_ONBOARDING_2}
        component={Onboarding2Screen}
        options={{
          headerTitle: '',
        }}
      />
      <Stack.Screen
        name={introNavigations.INTRO_ONBOARDING_3}
        component={Onboarding3Screen}
        options={{
          headerTitle: '',
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});

export default AuthStackNavigator;
