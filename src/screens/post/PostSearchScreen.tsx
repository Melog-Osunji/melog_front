import React from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {StyleSheet, Text, View} from 'react-native';

import {PostStackParamList} from '@/navigations/stack/PostStackNavigator';
import {postNavigations} from '@/constants';

type IntroScreenProps = StackScreenProps<
  PostStackParamList,
  typeof postNavigations.POST_SEARCH
>;

function AuthHomeScreen({navigation}: IntroScreenProps) {
  return (
    <View style={styles.container}>
      <Text>melog_front/src/screens/post/PostSearchScreen.tsx</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AuthHomeScreen;
