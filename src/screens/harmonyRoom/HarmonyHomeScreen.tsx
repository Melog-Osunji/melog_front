import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

function AuthHomeScreen() {
  return (
    <View style={styles.container}>
      <Text>harmony room</Text>
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
