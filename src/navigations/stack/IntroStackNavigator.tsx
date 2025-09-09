import React from 'react';
import {StyleSheet} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';

import WelcomeScreen from '@/screens/intro/WelcomeScreen';
import LoginScreen from '@/screens/intro/LoginSreen';
import Onboarding1Screen from '@/screens/intro/Onboarding1Screen';
import Onboarding2Screen from '@/screens/intro/Onboarding2Screen';
import Onboarding3Screen from '@/screens/intro/Onboarding3Screen';

import {introNavigations} from '@/constants';

export type IntroStackParamList = {
  [introNavigations.INTRO_LOGIN]: undefined;
  [introNavigations.INTRO_WELCOME]: undefined;
  [introNavigations.INTRO_ONBOARDING_1]: undefined;
  [introNavigations.INTRO_ONBOARDING_2]: undefined;
  [introNavigations.INTRO_ONBOARDING_3]: undefined;
};

const Stack = createStackNavigator<IntroStackParamList>();

function AuthStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyle: {backgroundColor: '#fff'},
      }}>
      <Stack.Screen
        name={introNavigations.INTRO_LOGIN}
        component={LoginScreen}
        options={{
          headerTitle: ' ',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={introNavigations.INTRO_WELCOME}
        component={WelcomeScreen}
        options={{
          headerTitle: ' ',
          headerShown: false,
        }}
      />
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
