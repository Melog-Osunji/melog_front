import React from 'react';
import {StyleSheet, Text, View, ScrollView, Image, Dimensions, FlatList} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {HarmonyStackParamList} from '@/navigations/stack/HarmonyStackNavigator';
import styled from 'styled-components/native';
import {colors, postNavigations, harmonyNavigations} from '@/constants';
import IconButton from '@/components/common/IconButton';
import LinearGradient from 'react-native-linear-gradient';
import ListButton from '@/components/ListButton';
import {HarmonyRoomDummyData} from '@/constants/types';
import HarmonyRoomCard from '@/components/harmonyRoom/HarmonyRoomCard';


const DEVICE_WIDTH = Dimensions.get('window').width;


function HarmonyHomeScreen() {

  const navigation = useNavigation<StackNavigationProp<HarmonyStackParamList>>();

  return (
    <Container>
        <Header>
            <HeaderTitleText>하모니룸</HeaderTitleText>
            <HeaderIconRow>
              <IconButton<PostStackParamList>
                imageSource={require('@/assets/icons/post/Search.png')}
                target={[postNavigations.POST_SEARCH]}
              />
              <IconButton<PostStackParamList>
                imageSource={require('@/assets/icons/post/Notice.png')}
                target={[postNavigations.POST_SEARCH]}
              />
            </HeaderIconRow>
        </Header>
    <ScrollView contentContainerStyle={{ paddingHorizontal: 20, }}>
        <CardContainer
              colors={['#FFF9D8', '#C5ECFF', '#549DBD']}
              locations={[0, 0.21, 1]}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}>
              <LeftSection>
                <SubTitle>어떤 클래식을 듣고 싶으세요?</SubTitle>
                <Title>직접 클래식 음악 감상룸을{'\n'}만들어봐요!</Title>
                <HarmonyCreateButton onPress={() => navigation.navigate(harmonyNavigations.HARMONY_CREATE)}>
                  <ButtonText>하모니룸 만들기</ButtonText>
                </HarmonyCreateButton>
              </LeftSection>
              <NotesImage source={require('@/assets/icons/harmonyRoom/Harmony3dIcon2.png')} />
              <Gramophone source={require('@/assets/icons/harmonyRoom/Harmony3dIcon1.png')} />
        </CardContainer>
        <RealTimeWrap>
            <SectionTitle>실시간 인기 하모니룸</SectionTitle>
            <ListButton
                label = "하모니룸 이용 가이드 보기"
            />
            <FlatList
                data={HarmonyRoomDummyData}
                keyExtractor={(item) => item.roomID}
                numColumns={2}
                columnWrapperStyle={{justifyContent: 'space-between'}}
                renderItem={({item, index}) => (
                  <HarmonyRoomCard data={item} index={index}/>
                )}
                scrollEnabled={false}
              />
        </RealTimeWrap>
    </ScrollView>
    </Container>
  );
}

// Styled Components
const Header = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: 20px;
  padding-vertical: 16px;
`;

const HeaderTitleText = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${colors.BLACK};
`;

const HeaderIconRow = styled.View`
  flex-direction: row;
  gap: 8px;
`;

const Container = styled(SafeAreaView)`
  flex: 1;
  align-items: center;
  background-color: ${colors.WHITE};
  margin-bottom: 40px;
`;

const CardContainer = styled(LinearGradient)`
    width: ${DEVICE_WIDTH - 40}px;
    height:170px;
    border-radius: 16px;
    padding: 24px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-top: 20px;
    position:relative;
`;

const LeftSection = styled.View`
  flex: 1;
`;

const SubTitle = styled.Text`
  font-size: 12px;
  color: ${colors.BLUE_600};
  margin-bottom: 2px;
`;

const Title = styled.Text`
  font-size: 17px;
  color: ${colors.BLUE_700};
  font-weight: 600;
  line-height: 24px;
`;

const HarmonyCreateButton = styled.TouchableOpacity`
  margin-top: 20px;
  background-color: ${colors.WHITE};
  padding: 12px 24px;
  border-radius: 999px;
  align-self: flex-start;
`;

const ButtonText = styled.Text`
  font-size: 15px;
  line-height:22px;
  color: ${colors.BLUE_500};
  font-weight: bold;
`;

const NotesImage = styled(Image)`
  position: absolute;
  right: 110px;
  bottom: 50px;
  z-index: 2;
`;

const Gramophone = styled(Image)`
  position: absolute;
  right: 20px;
  bottom: 25px;
  z-index: 1;
`;

const RealTimeWrap = styled.View`
    flex-direction:column;
    width: ${DEVICE_WIDTH - 40}px;

    margin-vertical: 16px;
`;

const SectionTitle = styled.Text`
    font-size: 17px;
    line-height:24px;
    font-weight:600;
    color:${colors.GRAY_600};
    margin-bottom: 12px;
`;




export default HarmonyHomeScreen;
