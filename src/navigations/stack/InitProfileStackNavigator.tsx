import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {InitProfileNavigations} from '@/constants';
//screens
import InitProfileImg from '@/screens/intro/InitProfile/InitProfileImgScreen';
import InitProfileNickname from '@/screens/intro/InitProfile/InitProfileNicknameScreen';
import InitProfileIntroduction from '@/screens/intro/InitProfile/InitProfileIntroductionScreen';

export type InitProfileNavigatorParamList = {
  [InitProfileNavigations.INIT_PROFILE_IMG]: undefined;
  // route params include both 서버 업로드된 URL(profileImg)과
  // 로컬 표시용 이미지 URI(imageUri)
  [InitProfileNavigations.INIT_PROFILE_NICKNAME]:
    | {uploadedImageUrl?: string | null; selectedImage?: string | null}
    | undefined;
  [InitProfileNavigations.INIT_PROFILE_INTRODUCTION]:
    | {profileImg?: string | null; imageUri?: string | null}
    | undefined;
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
      <Stack.Screen //현재 사용하지 않음
        name={InitProfileNavigations.INIT_PROFILE_INTRODUCTION}
        component={InitProfileIntroduction}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export default HarmonyStackNavigator;
