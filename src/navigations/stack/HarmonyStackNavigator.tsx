import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HarmonyHomeScreen from '@/screens/harmonyRoom/HarmonyHomeScreen';
import HarmonyPageScreen from '@/screens/harmonyRoom/HarmonyPageScreen';
import HarmonyCreateScreen from '@/screens/harmonyRoom/HarmonyCreateScreen';
import HarmonyEditScreen from '@/screens/harmonyRoom/HarmonyEditScreen';
import HarmonyInfoScreen from '@/screens/harmonyRoom/HarmonyInfoScreen';
import HarmonySettingScreen from '@/screens/harmonyRoom/HarmonySettingScreen';
import HarmonyListScreen from '@/screens/harmonyRoom/HarmonyListScreen';
import HarmonyApplyManageScreen from '@/screens/harmonyRoom/HarmonyApplyManageScreen';
import HarmonyPostScreen from '@/screens/harmonyRoom/HarmonyPostScreen';
import HarmonySearchScreen from '@/screens/harmonyRoom/HarmonySearchScreen';
import HarmonySearchResultScreen from '@/screens/harmonyRoom/HarmonySearchResultScreen';
import {harmonyNavigations} from '@/constants';
import {MAIN_TAB_SCREEN_OPTIONS} from '@/navigations/tab/MainTabNavigator';
import {HarmonyRoomInfo} from '@/constants/types';
import {HarmonyRoomProvider} from '@/contexts/HarmonyRoomContext';
import PostPageScreen from '@/screens/post/PostPageScreen';


export type HarmonyStackParamList = {
  [harmonyNavigations.HARMONY_HOME]: undefined;
  [harmonyNavigations.HARMONY_PAGE]: {
    roomID: string;
    roomData?: HarmonyRoomInfo;
  };
  [harmonyNavigations.HARMONY_CREATE]: undefined;
  [harmonyNavigations.HARMONY_INFO] : {roomID: string, roomData?: HarmonyRoomInfo};
  [harmonyNavigations.HARMONY_EDIT]: {roomID: string};
  [harmonyNavigations.HARMONY_SETTING] : {roomID: string};
  [harmonyNavigations.HARMONY_LIST]: undefined ;
  [harmonyNavigations.HARMONY_APPLY]: {roomID: string};
  [harmonyNavigations.HARMONY_POST]: {roomID: string};
  [harmonyNavigations.HARMONY_SEARCH]: undefined;
  [harmonyNavigations.HARMONY_SEARCH_RESULT]: {searchKeyword: string};
  HARMONY_POST_PAGE: { postId: string };
};

const Stack = createStackNavigator<HarmonyStackParamList>();

function HarmonyStackNavigator() {
  return (
    <HarmonyRoomProvider>
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
        <Stack.Screen
          name={harmonyNavigations.HARMONY_INFO}
          component={HarmonyInfoScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={harmonyNavigations.HARMONY_EDIT}
          component={HarmonyEditScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={harmonyNavigations.HARMONY_SETTING}
          component={HarmonySettingScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={harmonyNavigations.HARMONY_LIST}
          component={HarmonyListScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={harmonyNavigations.HARMONY_APPLY}
          component={HarmonyApplyManageScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={harmonyNavigations.HARMONY_POST}
          component={HarmonyPostScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={harmonyNavigations.HARMONY_SEARCH}
          component={HarmonySearchScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={harmonyNavigations.HARMONY_SEARCH_RESULT}
          component={HarmonySearchResultScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="HARMONY_POST_PAGE"
          component={PostPageScreen}
          options={{ headerShown: false }}
         />
      </Stack.Navigator>
    </HarmonyRoomProvider>
  );
}

export default HarmonyStackNavigator;
