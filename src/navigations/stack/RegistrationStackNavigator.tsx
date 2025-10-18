import React from 'react';
import {
  createStackNavigator,
  CardStyleInterpolators,
  TransitionSpecs,
} from '@react-navigation/stack';
//screens
import ConsentList from '@/screens/intro/ToS/ConsentList';
import AgreementViewer from '@/screens/intro/ToS/AgreementViewer';
import InitProfileStackNavigator from '@/navigations/stack/InitProfileStackNavigator';
import Onboarding1Screen from '@/screens/intro/Onboarding/Onboarding1Screen';
import Onboarding2Screen from '@/screens/intro/Onboarding/Onboarding2Screen';
import Onboarding3Screen from '@/screens/intro/Onboarding/Onboarding3Screen';

export type RegistrationStackParamList = {
  ConsentList: undefined;
  AgreementViewer: {docId: string};
  IntroProfile: undefined;
  IntroOnboarding1: {onDone?: () => void} | undefined;
  IntroOnboarding2: {onDone?: () => void} | undefined;
  IntroOnboarding3: {onDone?: () => void} | undefined;
};

const Stack = createStackNavigator<RegistrationStackParamList>();

function RegistrationStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="ConsentList"
      screenOptions={{
        cardStyle: {backgroundColor: '#fff'},
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        transitionSpec: {
          open: TransitionSpecs.TransitionIOSSpec,
          close: TransitionSpecs.TransitionIOSSpec,
        },
      }}>
      {/* 이용약관 */}
      <Stack.Screen
        name="ConsentList"
        component={ConsentList}
        options={{
          headerTitle: ' ',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AgreementViewer"
        component={AgreementViewer}
        options={{
          headerTitle: ' ',
          headerShown: false,
        }}
      />

      {/* 최초프로필설정 */}
      <Stack.Screen
        name="IntroProfile"
        component={InitProfileStackNavigator}
        options={{
          headerShown: false,
        }}
      />

      {/* 맞춤형온보딩 */}
      <Stack.Screen
        name="IntroOnboarding1"
        component={Onboarding1Screen}
        options={{
          headerTitle: '',
        }}
      />
      <Stack.Screen
        name="IntroOnboarding2"
        component={Onboarding2Screen}
        options={{
          headerTitle: '',
        }}
      />
      <Stack.Screen
        name="IntroOnboarding3"
        component={Onboarding3Screen}
        options={{
          headerTitle: '',
        }}
      />
    </Stack.Navigator>
  );
}

export default RegistrationStackNavigator;
