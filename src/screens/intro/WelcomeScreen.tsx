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

export default WelcomeScreen;
