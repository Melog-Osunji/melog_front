import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HarmonyHomeScreen from '@/screens/harmonyRoom/HarmonyHomeScreen';
import HarmonyPageScreen from '@/screens/harmonyRoom/HarmonyPageScreen';
import HarmonyCreateScreen from '@/screens/harmonyRoom/HarmonyCreateScreen';
import {harmonyNavigations} from '@/constants';
import {MAIN_TAB_SCREEN_OPTIONS} from '@/navigations/tab/MainTabNavigator';
import {HarmonyRoomInfo} from '@/constants/types';


export type HarmonyStackParamList = {
  [harmonyNavigations.HARMONY_HOME]: undefined;
  [harmonyNavigations.HARMONY_PAGE]: {roomId: string; roomData?: HarmonyRoomInfo};
  [harmonyNavigations.HARMONY_CREATE]: undefined;
};

const Stack = createStackNavigator<MapStackParamList>();

function HarmonyStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={harmonyNavigations.HARMONY_HOME}
        component={HarmonyHomeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
          name={harmonyNavigations.HARMONY_PAGE}
          component={HarmonyPageScreen}
          options={{headerShown: false}}
        />
      <Stack.Screen
        name={harmonyNavigations.HARMONY_CREATE}
        component={HarmonyCreateScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export default HarmonyStackNavigator;
