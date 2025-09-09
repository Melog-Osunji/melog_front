import React from 'react';

import {StyleSheet, Text, View, Image} from 'react-native';

function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/common/bg.png')}
        style={{
          ...StyleSheet.absoluteFillObject,
          width: '100%',
          height: '100%',
        }}
      />
      <Image
        source={require('@/assets/common/app_name.png')}
        style={{
          width: 170,
          height: 80,
          resizeMode: 'contain',
        }}
      />
      <Text style={styles.text}>클래식을 감상하고 기록할 수 있는 공간</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'NotoSansKR',
    fontSize: 16,
    color: '#2F8EB6',
  },
});

export default WelcomeScreen;
