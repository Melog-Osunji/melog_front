import React from 'react';
import { FlatList, Text } from 'react-native';
import styled from 'styled-components/native';

const composers = Array.from({ length: 12 }).map((_, i) => `이름 ${i}`);

const SearchComposerTab = () => {
  return (
    <FlatList
      contentContainerStyle={{ padding: 20 }}
      data={composers}
      numColumns={3}
      keyExtractor={(_, i) => String(i)}
      renderItem={({ item }) => (
        <GridItem>
          <Circle />
          <Name>{item}</Name>
        </GridItem>
      )}
    />
  );
};

const GridItem = styled.View`
  align-items: center;
  width: 33%;
  margin-vertical: 12px;
`;

const Circle = styled.View`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: lightgray;
  margin-bottom: 6px;
`;

const Name = styled.Text``;

export default SearchComposerTab;
