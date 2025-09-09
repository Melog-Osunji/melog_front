import React from 'react';

import {StyleSheet, Text, View, Image} from 'react-native';

function InitProfile() {
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
      <Text style={styles.text}>asdfasdf</Text>
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

export default InitProfile;
