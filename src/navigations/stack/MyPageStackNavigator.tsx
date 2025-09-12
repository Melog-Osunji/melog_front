import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {myPageNavigations} from '@/constants';
import {MAIN_TAB_SCREEN_OPTIONS} from '@/navigations/tab/MainTabNavigator';
import MyPageHomeScreen from '@/screens/mypage/MyPageHomeScreen';
import MyPageEditScreen from '@/screens/mypage/MyPageEditScreen';

export type MyPageStackParamList = {
  [myPageNavigations.MYPAGE_HOME]: undefined;
  [myPageNavigations.MYPAGE_EDIT]: undefined;
};

const Stack = createStackNavigator<MyPageStackParamList>();

function MyPageStackNavigator() {
  return (
        <Stack.Navigator>
          <Stack.Screen
            name={myPageNavigations.MYPAGE_HOME}
            component={MyPageHomeScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
              name={myPageNavigations.MYPAGE_EDIT}
              component={MyPageEditScreen}
              options={{headerShown: false}}
            />
        </Stack.Navigator>
  );
}

export default MyPageStackNavigator;
