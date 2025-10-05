import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {login, getProfile} from '@react-native-seoul/kakao-login';

export const App = () => {
  const signInWithKakao = async () => {
    const token = await login();

    console.log(token);

    const profile = await getProfile();

    console.log(profile);
  };
};
