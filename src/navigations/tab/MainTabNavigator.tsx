import React from 'react';
import {Image, View, Platform} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import HarmonyRoom from '@/screens/harmonyRoom/HarmonyHomeScreen';
import PostHomeScreen from '@/screens/post/PostHomeScreen';

import HarmonyStackNavigator from '../stack/HarmonyStackNavigator';
import PostStackNavigator from '../stack/PostStackNavigator';
import CalendarHomeScreen from '@/screens/calendar/CalendarHomeScreen';
import MyPageStackNavigator from '../stack/MyPageStackNavigator';

import {colors} from '@/constants/colors';

const Tab = createBottomTabNavigator();
const TAB_ICON_SIZE = 48;

import {Dimensions} from 'react-native';

const TAB_BAR_HEIGHT = Dimensions.get('window').height * 0.075;

export const TAB_BAR_STYLE = {
  paddingHorizontal: 18,
  paddingVertical: 10,
  width: Dimensions.get('window').width,
  height: TAB_BAR_HEIGHT,
  backgroundColor: colors.WHITE,
  overflow: 'visible' as 'visible',
  position: 'absolute' as 'absolute',
};

export const MAIN_TAB_SCREEN_OPTIONS = {
  headerShown: false,
  tabBarStyle: TAB_BAR_STYLE,
};

function MainTabNavigator() {
  return (
    <Tab.Navigator screenOptions={MAIN_TAB_SCREEN_OPTIONS}>
      {/*home*/}
      <Tab.Screen
        name="home"
        component={PostStackNavigator}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({focused}) => (
            <Image
              source={
                focused
                  ? require('@/assets/icons/tab_bar/home_icon_activate.png')
                  : require('@/assets/icons/tab_bar/home_icon.png')
              }
              style={{
                width: TAB_ICON_SIZE,
                height: TAB_ICON_SIZE,
              }}
              resizeMode="contain"
            />
          ),
        }}
      />

      {/*harmonyroom*/}
      <Tab.Screen
        name="harmonyroom"
        component={HarmonyStackNavigator}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({focused}) => (
            <Image
              source={
                focused
                  ? require('@/assets/icons/tab_bar/harmonyroom_icon_activate.png')
                  : require('@/assets/icons/tab_bar/harmonyroom_icon.png')
              }
              style={{
                width: TAB_ICON_SIZE,
                height: TAB_ICON_SIZE,
              }}
              resizeMode="contain"
            />
          ),
        }}
      />

      {/*calendar*/}
      <Tab.Screen
        name="calendar"
        component={CalendarHomeScreen}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({focused}) => (
            <Image
              source={
                focused
                  ? require('@/assets/icons/tab_bar/calendar_icon_activate.png')
                  : require('@/assets/icons/tab_bar/calendar_icon.png')
              }
              style={{
                width: TAB_ICON_SIZE,
                height: TAB_ICON_SIZE,
              }}
              resizeMode="contain"
            />
          ),
        }}
      />

      {/* mypage */}
      <Tab.Screen
        name="MY"
        component={MyPageStackNavigator}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({focused}) => (
            <Image
              source={
                focused
                  ? require('@/assets/icons/tab_bar/mypage_icon_activate.png')
                  : require('@/assets/icons/tab_bar/mypage_icon.png')
              }
              style={{
                width: TAB_ICON_SIZE,
                height: TAB_ICON_SIZE,
                // ...(focused && {tintColor: colors.BLACK}), // focused일 때만 tintColor 적용
              }}
              resizeMode="contain"
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default MainTabNavigator;
