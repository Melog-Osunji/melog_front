// src/screens/AgreementViewer.tsx
import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
//navigator
import {StackScreenProps} from '@react-navigation/stack';
import {IntroStackParamList} from '@/navigations/stack/IntroStackNavigator';
//data loader
import {AgreementsLoader} from '@/utils/AgreementsLoader';
import Markdown from 'react-native-markdown-display';
//constants
import {introNavigations, colors} from '@/constants';
//components
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

  useEffect(() => {
    AgreementsLoader(docId).then(setDoc);
    AgreementsLoader(docId).then(data => console.log('Loaded doc:', data));
  }, [docId]);

  if (!doc) return <ActivityIndicator style={{marginTop: 20}} />;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>{doc.title}</Text>
        <Markdown>{doc.body}</Markdown>
        <CustomButton
          label="확인되었습니다"
          style={{
        marginVertical: 20,
        backgroundColor: colors.BLUE_500,
          }}
          onPress={() => {
        navigation.goBack();
          }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignContent: 'center',
  },
  header: {fontSize: 18, fontWeight: 'bold', marginBottom: 12},
});
