import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import SettingHeader from '@/components/settings/SettingHeader';
import {AGREEMENTS} from '@/constants';

export default function PrivacyPolicyScreen() {
  return (
    <View style={styles.screen}>
      <SettingHeader title="개인정보 처리방침" />
      <View style={styles.body}>
        <Text style={styles.text}>PrivacyPolicyScreen</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: '#fff'},

  body: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  text: {fontSize: 18},
});
