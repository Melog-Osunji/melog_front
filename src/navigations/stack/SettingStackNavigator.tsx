import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {settingsNavigations} from '@/constants';
// SettingsHomeScreen
import SettingsHomeScreen from '@/screens/settings/SettingsHomeScreen';
// user-management
import ActivityScopeScreen from '@/screens/settings/user-management/ActivityScopeScreen';
import FollowerRequestsScreen from '@/screens/settings/user-management/FollowerRequestsScreen';
import BlockedUsersScreen from '@/screens/settings/user-management/BlockedUsersScreen';
// notification
import NoticesScreen from '@/screens/settings/notification/NoticesScreen';
import SupportScreen from '@/screens/settings/notification/SupportScreen';
import SupportFormScreen from '@/screens/settings/notification/SupportFormScreen';
// service-info
import TermsOfServiceScreen from '@/screens/settings/service-info/TermsOfServiceScreen';
import PrivacyPolicyScreen from '@/screens/settings/service-info/PrivacyPolicyScreen';
// etc
import LanguageSettingScreen from '@/screens/settings/etc/LanguageSettingScreen';
// account
import AccountDeleteScreen from '@/screens/settings/account/AccountDeleteScreen';

export type SettingNavigatorParamList = {
  [settingsNavigations.SETTINGS_HOME]: undefined;
  [settingsNavigations.ACTIVITY_SCOPE]: {userId: string};
  [settingsNavigations.FOLLOWER_REQUESTS]: {userId: string};
  [settingsNavigations.BLOCKED_USERS]: {userId: string};
  [settingsNavigations.NOTICES]: undefined;
  [settingsNavigations.SUPPORT]: {userId: string};
  [settingsNavigations.SUPPORT_FORM]: {
    userId: string;
    title?: string;
    category?: string[];
    onPress?: () => void;
  };
  [settingsNavigations.TERMS_OF_SERVICE]: undefined;
  [settingsNavigations.PRIVACY_POLICY]: undefined;
  [settingsNavigations.LANGUAGE_SETTING]: undefined;
  [settingsNavigations.ACCOUNT_DELETE]: {userId: string};
};

const Stack = createStackNavigator<SettingNavigatorParamList>();

function SettingStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name={settingsNavigations.SETTINGS_HOME}
        component={SettingsHomeScreen}
      />
      <Stack.Screen
        name={settingsNavigations.ACTIVITY_SCOPE}
        component={ActivityScopeScreen}
      />
      <Stack.Screen
        name={settingsNavigations.FOLLOWER_REQUESTS}
        component={FollowerRequestsScreen}
      />
      <Stack.Screen
        name={settingsNavigations.BLOCKED_USERS}
        component={BlockedUsersScreen}
      />
      <Stack.Screen
        name={settingsNavigations.NOTICES}
        component={NoticesScreen}
      />
      <Stack.Screen
        name={settingsNavigations.SUPPORT}
        component={SupportScreen}
      />
      <Stack.Screen
        name={settingsNavigations.SUPPORT_FORM}
        component={SupportFormScreen}
      />
      <Stack.Screen
        name={settingsNavigations.TERMS_OF_SERVICE}
        component={TermsOfServiceScreen}
      />
      <Stack.Screen
        name={settingsNavigations.PRIVACY_POLICY}
        component={PrivacyPolicyScreen}
      />
      <Stack.Screen
        name={settingsNavigations.LANGUAGE_SETTING}
        component={LanguageSettingScreen}
      />
      <Stack.Screen
        name={settingsNavigations.ACCOUNT_DELETE}
        component={AccountDeleteScreen}
      />
    </Stack.Navigator>
  );
}

export default SettingStackNavigator;
