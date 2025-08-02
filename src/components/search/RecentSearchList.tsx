import React from 'react';
import styled from 'styled-components/native';
import {colors} from '@/constants';
import {
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import DeleteButton from '@/assets/icons/post/Delete.png';

const DEVICE_WIDTH = Dimensions.get('window').width;

interface Props {
  keywords: string[];
  onClearOne: (keyword: string) => void;
  onClearAll: () => void;
}

const RecentSearchList: React.FC<Props> = ({
  keywords,
  onClearOne,
  onClearAll,
}) => {
  return (
    <ScrollView>
      <Row>
        <SectionTitle>최근 검색어</SectionTitle>
        <ClearAll onPress={onClearAll}>
          <ClearAllText>전체삭제</ClearAllText>
        </ClearAll>
      </Row>
      {keywords.map((keyword, i) => (
        <ItemRow key={i}>
          <KeywordText>{keyword}</KeywordText>
          <TouchableOpacity onPress={() => onClearOne(keyword)}>
            <Image
              source={DeleteButton}
              style={{width: 24, height: 24}}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </ItemRow>
      ))}
    </ScrollView>
  );
};

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
`;

const SectionTitle = styled.Text`
  font-size: 17px;
  font-weight: 700;
  color: ${colors.GRAY_600};
`;

const ClearAll = styled.TouchableOpacity``;

const ClearAllText = styled.Text`
  font-size: 12px;
  line-height: 16px;
  color: ${colors.GRAY_400};
`;

const ItemRow = styled.View`
  width: 100%;
  height: 48px;
  flex-direction: row;
  justify-content: space-between;
  padding: 12px 0px;
`;

const KeywordText = styled.Text`
  font-size: 15px;
  line-height: 22px;
  color: ${colors.GRAY_600};
`;
export default RecentSearchList;
