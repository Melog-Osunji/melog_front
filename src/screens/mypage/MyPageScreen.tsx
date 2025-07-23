import React from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '@/constants';
import CustomHeader from '@/components/CustomHeader';

function CalendarHomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>mypage</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CalendarHomeScreen;
