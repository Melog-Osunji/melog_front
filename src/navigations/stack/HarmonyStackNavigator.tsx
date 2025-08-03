import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import MapHomeScreen from '@/screens/harmonyRoom/HarmonyHomeScreen';
import {harmonyNavigations} from '@/constants';
import {MAIN_TAB_SCREEN_OPTIONS} from '@/navigations/tab/MainTabNavigator';

export type HarmonyStackParamList = {
  [harmonyNavigations.HARMONY_HOME]: undefined;
  [harmonyNavigations.HARMONY_PAGE]: undefined;
  [harmonyNavigations.HARMONY_CREATE]: undefined;
};

const Stack = createStackNavigator<MapStackParamList>();

function HarmonyStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={harmonyNavigations.HARMONY_HOME}
        component={MapHomeScreen}
        options={{...MAIN_TAB_SCREEN_OPTIONS, headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export default HarmonyStackNavigator;
