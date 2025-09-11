// src/screens/AgreementViewer.tsx
import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {loadDummyAgreement} from '@/utils/agreements_loader';
import Markdown from 'react-native-markdown-display';
import {StackScreenProps} from '@react-navigation/stack';
import {IntroStackParamList} from '@/navigations/stack/IntroStackNavigator';
import {introNavigations} from '@/constants';
import CustomButton from '@/components/common/CustomButton';

type AgreementViewerProps = StackScreenProps<
  IntroStackParamList,
  typeof introNavigations.TOS_AGREEMENT_VIEWER
>;

export default function AgreementViewer({
  route,
  navigation,
}: AgreementViewerProps) {
  const {docId} = route.params;
  const [doc, setDoc] = useState<any>(null);
  console.log('****docId:', docId);
  useEffect(() => {
    loadDummyAgreement(docId).then(setDoc);
    console.log('docId:', docId);
    loadDummyAgreement(docId).then(data => console.log('Loaded doc:', data));
  }, [docId]);

  if (!doc) return <ActivityIndicator style={{marginTop: 20}} />;

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.header}>{doc.title}</Text>
        <Markdown>{doc.body}</Markdown>
      </ScrollView>
      <CustomButton
        label="뒤로가기"
        style={{position: 'absolute', bottom: 30, left: 24, right: 24}}
        onPress={() => {
          navigation.goBack();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, backgroundColor: '#fff'},
  header: {fontSize: 18, fontWeight: 'bold', marginBottom: 12},
});
