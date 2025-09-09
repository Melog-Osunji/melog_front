import React from 'react';

import {StyleSheet, Text, View, Image} from 'react-native';

function InitProfile() {
  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/common/app_name.png')}
        style={{
          width: 170,
          height: 80,
          resizeMode: 'contain',
        }}
      />
      <Text style={styles.text}>asdfasdf</Text>
      <View style={{marginTop: 24}}>
        <Text
          onPress={() => {
            // @ts-ignore
            if (typeof navigation !== 'undefined' && navigation.goBack) {
              navigation.goBack();
            }
          }}
          style={{
            backgroundColor: '#000',
            color: '#fff',
            paddingVertical: 12,
            paddingHorizontal: 32,
            borderRadius: 8,
            textAlign: 'center',
            fontSize: 16,
            fontWeight: 'bold',
            overflow: 'hidden',
          }}>
          뒤로가기
        </Text>
      </View>
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
