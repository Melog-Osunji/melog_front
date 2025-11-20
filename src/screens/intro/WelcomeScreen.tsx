import React from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {StyleSheet, Text, View} from 'react-native';
import {Image} from 'react-native';

function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/common/bg.png')}
        style={{position: 'absolute', width: '100%', height: '100%'}}
        resizeMode="cover"
      />
      <Image
        source={require('../../assets/icons/common/appname.png')}
        style={{width: 200, height: 60, marginBottom: 16}}
        resizeMode="contain"
      />
      <Text style={styles.info}>클래식을 감상하고 기록할 수 있는 공간</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {},
  info: {
    color: '#2F8EB6',
    fontFamily: 'Noto Sans KR',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: 0.25,
    marginBottom: 20,
  },
});

export default WelcomeScreen;
