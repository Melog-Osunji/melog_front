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
import {AgreementsLoader} from '@/utils/agreements_loader';
import Markdown from 'react-native-markdown-display';
//constants
import {introNavigations, colors} from '@/constants';
//components
import CustomButton from '@/components/common/CustomButton';
import IconButton from '@/components/common/IconButton';

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
      <View style={styles.header}>
        <Text style={styles.title}>{doc.title}</Text>
        <IconButton
          imageSource={require('@/assets/icons/common/close.png')}
          size={24}
          target="goBack"
          imageStyle={{tintColor: colors.GRAY_300}}
        />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            height: 30,
          }}
        />

        <Markdown style={markdownStyles}>{doc.body}</Markdown>
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
  header: {justifyContent: 'space-between', flexDirection: 'row'},
  title: {
    color: colors.BLACK,
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 12,
  },
});

const markdownStyles = {
  body: {
    color: colors.BLACK,
    fontSize: 14,
    lineHeight: 22,
  },
  heading1: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.BLACK,
    marginBottom: 12,
  },
  heading2: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.BLACK,
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 14,
    color: colors.BLACK,
    marginBottom: 20,
  },
  strong: {
    fontWeight: 'bold',
    color: colors.BLACK,
  },
  link: {
    color: colors.BLUE_500,
    textDecorationLine: 'underline',
  },
  list_item: {
    fontSize: 14,
    color: colors.BLACK,
    marginBottom: 20,
  },
} as const;
