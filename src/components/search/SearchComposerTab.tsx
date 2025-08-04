import React from 'react';
import { FlatList, Text, ScrollView, Dimensions } from 'react-native';
import styled from 'styled-components/native';
import {colors} from '@/constants';
import {SafeAreaView} from 'react-native-safe-area-context';

const SCREEN_WIDTH = Dimensions.get('window').width;
const PADDING_HORIZONTAL = 20;
const ITEM_WIDTH = (SCREEN_WIDTH - PADDING_HORIZONTAL * 2) / 3;


const composers = [
  {
    name: "베토벤",
    image: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Beethoven.jpg",
  },
  {
    name: "모차르트",
    image: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Wolfgang-amadeus-mozart_1.jpg",
  },
  {
    name: "바흐",
    image: "https://upload.wikimedia.org/wikipedia/commons/b/b5/Bach.jpg",
  },
  {
    name: "쇼팽",
    image: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Frederic_Chopin_photo.jpeg",
  },
  {
    name: "차이콥스키",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/20/Tchaikovsky_by_Reutlinger_%28cropped%29.jpg",
  },
  {
    name: "드뷔시",
    image: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Claude_Debussy_ca_1908%2C_foto_av_F%C3%A9lix_Nadar.jpg",
  },
  {
    name: "스트라빈스키",
    image: "https://upload.wikimedia.org/wikipedia/commons/3/33/Igor_Stravinsky_LOC_32392u.jpg",
  },
  {
    name: "말러",
    image: "https://upload.wikimedia.org/wikipedia/commons/e/ec/Gustav_Mahler_1909.jpg",
  },
  {
    name: "슈베르트",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/47/Franz_Schubert_by_Wilhelm_August_Rieder_1875_larger_version_crop.png",
  },
  {
    name: "라흐마니노프",
    image: "https://upload.wikimedia.org/wikipedia/commons/b/be/Sergei_Rachmaninoff_cph.3a40575.jpg",
  },
  {
    name: "김택수",
    image: "https://www.texukim.com/uploads/2/6/1/4/26145331/texu-2024-1_orig.jpg",
  },
  {
    name: "사리아호",
    image: "https://oopperabaletti.fi/app/uploads/2023/06/2BH1152-scaled.jpg",
  },
];

const SearchComposerTab = () => {
  return (
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16, flexGrow: 1}}>
          <SectionTitle>인기 검색어</SectionTitle>
          <GridWrap>
            {composers.map((composer, idx) => (
              <GridItem key={idx}>
                <CircleImage source={{ uri: composer.image }} resizeMode="cover" />
                <Name>{composer.name}</Name>
              </GridItem>
            ))}
          </GridWrap>
      </ScrollView>
  );
};


const SectionTitle = styled.Text`
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 28px;
  color: ${colors.GRAY_600};
`;


const GridWrap = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
`;

const GridItem = styled.View`
  align-items: center;
  margin-bottom: 24px;
`;

const CircleImage = styled.Image`
   width: 96px;
   height: 96px;
   border-radius: 48px;
   background-color: lightgray;
   margin-bottom: 12px;
`;

const Name = styled.Text``;

export default SearchComposerTab;
