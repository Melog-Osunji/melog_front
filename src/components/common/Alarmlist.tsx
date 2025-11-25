import React from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import Alarmitem from './Alarmitem';

type Alert = {
  id: string;
  type?: string;
  title: string;
  content: string;
  profileUri?: string | null;
};

type Props = {
  data?: Alert[];
};

export default function Alertlist({data}: Props) {
  const list = data && data.length ? data : [];

  return (
    <View style={s.container}>
      <FlatList
        data={list}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <Alarmitem
            type={item.type}
            title={item.title}
            content={item.content}
            profileUri={item.profileUri}
          />
        )}
        scrollEnabled={true}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
});
