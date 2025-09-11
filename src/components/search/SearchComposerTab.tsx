import React from 'react';
import { ScrollView, View, Image, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants';

const composers = [
  { name: '베토벤', image: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Beethoven.jpg' },
  { name: '모차르트', image: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Wolfgang-amadeus-mozart_1.jpg' },
  { name: '바흐', image: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Bach.jpg' },
  { name: '쇼팽', image: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Frederic_Chopin_photo.jpeg' },
  { name: '차이콥스키', image: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Tchaikovsky_by_Reutlinger_%28cropped%29.jpg' },
  { name: '드뷔시', image: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Claude_Debussy_ca_1908%2C_foto_av_F%C3%A9lix_Nadar.jpg' },
  { name: '스트라빈스키', image: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Igor_Stravinsky_LOC_32392u.jpg' },
  { name: '말러', image: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Gustav_Mahler_1909.jpg' },
  { name: '슈베르트', image: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Franz_Schubert_by_Wilhelm_August_Rieder_1875_larger_version_crop.png' },
  { name: '라흐마니노프', image: 'https://upload.wikimedia.org/wikipedia/commons/b/be/Sergei_Rachmaninoff_cph.3a40575.jpg' },
  { name: '김택수', image: 'https://www.texukim.com/uploads/2/6/1/4/26145331/texu-2024-1_orig.jpg' },
  { name: '사리아호', image: 'https://oopperabaletti.fi/app/uploads/2023/06/2BH1152-scaled.jpg' },
];

const SearchComposerTab = () => {
  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16, flexGrow: 1 }}>
      <Text style={styles.sectionTitle}>인기 검색어</Text>
      <View style={styles.gridWrap}>
        {composers.map((composer, idx) => (
          <View key={idx} style={styles.gridItem}>
            <Image source={{ uri: composer.image }} style={styles.circleImage} resizeMode="cover" />
            <Text style={styles.name}>{composer.name}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 28,
    color: colors.GRAY_600,
  },
  gridWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridItem: {
    alignItems: 'center',
    marginBottom: 24,
  },
  circleImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'lightgray',
    marginBottom: 12,
  },
  name: {
    color: colors.GRAY_600,
  },
});

export default SearchComposerTab;
