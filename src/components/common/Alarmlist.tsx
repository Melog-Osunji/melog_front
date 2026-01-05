import React from 'react';
import {FlatList} from 'react-native';
import Alarmitem from './Alarmitem';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {SettingStackParamList} from '@/navigations/stack/SettingStackNavigator';
import {settingsNavigations} from '@/constants';
import {notices} from '@/types/commonTypes';

type AlarmData = {
  id: string;
  type?: string;
  title: string;
  content: string;
  profileUri?: string | null;
  createdAt?: string;
  category?: string;
  imageUrl?: string | null;
  isImportant?: boolean;
};

type Props = {
  data: AlarmData[];
};

type NavProp = StackNavigationProp<SettingStackParamList>;

export default function Alarmlist({data}: Props) {
  const navigation = useNavigation<NavProp>();

  const handlePress = (item: AlarmData) => {
    navigation.navigate(settingsNavigations.NOTICES_PAGE, {
      notice: {
        id: item.id,
        title: item.title,
        content: item.content,
        createdAt: item.createdAt || new Date().toISOString(),
        category: item.category || item.type,
        imageUrl: item.imageUrl || item.profileUri,
        isImportant: item.isImportant,
      },
    });
  };

  return (
    <FlatList
      data={data}
      keyExtractor={item => item.id}
      renderItem={({item}) => (
        <Alarmitem
          type={item.type}
          title={item.title}
          content={item.content}
          profileUri={item.profileUri}
          onPress={() => handlePress(item)}
        />
      )}
    />
  );
}
