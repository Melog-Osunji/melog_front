import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {InitProfileNavigations} from '@/constants';

import InitProfileImg from '@/screens/intro/InitProfile/InitProfileImg';
import InitProfileNickname from '@/screens/intro/InitProfile/InitProfileNickname';
import InitProfileIntroduction from '@/screens/intro/InitProfile/InitProfileIntroduction';

export type InitProfileNavigatorParamList = {
  [InitProfileNavigations.INIT_PROFILE_IMG]: undefined;
  [InitProfileNavigations.INIT_PROFILE_NICKNAME]: undefined;
  [InitProfileNavigations.INIT_PROFILE_INTRODUCTION]: undefined;
};

const Stack = createStackNavigator<InitProfileNavigatorParamList>();

function HarmonyStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={InitProfileNavigations.INIT_PROFILE_IMG}
        component={InitProfileImg}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={InitProfileNavigations.INIT_PROFILE_NICKNAME}
        component={InitProfileNickname}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={InitProfileNavigations.INIT_PROFILE_INTRODUCTION}
        component={InitProfileIntroduction}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export default HarmonyStackNavigator;
