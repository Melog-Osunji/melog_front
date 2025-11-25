import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {myPageNavigations, harmonyNavigations} from '@/constants';
import {MAIN_TAB_SCREEN_OPTIONS} from '@/navigations/tab/MainTabNavigator';
import MyPageHomeScreen from '@/screens/mypage/MyPageHomeScreen';
import MyPageEditScreen from '@/screens/mypage/MyPageEditScreen';
import PostPageScreen from '@/screens/post/PostPageScreen';
import PersonalProfileScreen from '@/screens/mypage/PersonalProfileScreen';
import HarmonyStackNavigator from '@/navigations/stack/HarmonyStackNavigator';

export type MyPageStackParamList = {
  [myPageNavigations.MYPAGE_HOME]: undefined;
  [myPageNavigations.MYPAGE_EDIT]: undefined;
  [myPageNavigations.MYPAGE_POST_PAGE]: { postId: string };
  [myPageNavigations.MYPAGE_HARMONY_STACK]: { screen?: string; params?: any };
  [myPageNavigations.MYPAGE_MYPAGE_PROFILE]: {userId: string};
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
      <Stack.Screen
        name="MYPAGE_POST_PAGE"
        component={PostPageScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={myPageNavigations.MYPAGE_HARMONY_STACK}
        component={HarmonyStackNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={myPageNavigations.MYPAGE_MYPAGE_PROFILE}
        component={PersonalProfileScreen}
        options={{headerShown:false}}
      />
    </Stack.Navigator>
  );
}

export default MyPageStackNavigator;
