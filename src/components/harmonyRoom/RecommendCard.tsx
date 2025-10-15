import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {HarmonyStackParamList} from '@/navigations/stack/HarmonyStackNavigator';
import {StackNavigationProp} from '@react-navigation/stack';
import {harmonyRoomNavigation} from '@/constants';
import {colors, harmonyNavigations} from '@/constants';
import LinearGradient from 'react-native-linear-gradient';
import {recommendRoom} from '@/api/harmonyRoom/harmonRoomApi';

type Props = {
  data: recommendRoom;
};

export default function RecommendCard({data}: Props) {
  const navigation = useNavigation<StackNavigationProp<HarmonyStackParamList>>();

  const {id, name, category, profileImgLink, intro, memberNum, userProfileImgsUrl} = data;

  const handlePress = () => {
    navigation.navigate(harmonyNavigations.HARMONY_PAGE, {
      roomID: id,
    });
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.85}>
      <LinearGradient
             colors={['#EBF2F9','#F9FFFF']} // 원하는 색 배열
             start={{x: 0, y: 0}}
             end={{x: 1, y: 1}}
             style={styles.container}
      >
        <View style={styles.roomInfoWrap}>
          <Image source={{uri: profileImgLink}} style={styles.thumbnail}/>
          <View style={styles.roomInfo}>
            <Text style={styles.title}>{name}</Text>
            <View style={styles.infoTagRow}>
                <Text style={styles.tag} numberOfLines={1}>
                    {category.map(tag => `#${tag}`).join(' ')}
                </Text>
            </View>
           </View>
        </View>
        <Text style={styles.content}>{intro}</Text>
        <View style={styles.memberInfo}>
            <View style={styles.numWrap}>
                <Image source={require('@/assets/icons/harmonyRoom/FollowIcon.png')} style={styles.seeIcon}/>
                <Text style={styles.seeNum}>{memberNum}</Text>
            </View>
            <View style={styles.imgWrap}>
                <Image source={{uri: userProfileImgsUrl[0]}} style={styles.profileFirst}/>
                <Image source={{uri: userProfileImgsUrl[1]}} style={styles.profileLast}/>
            </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
    card: {
        width: '100%',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.GRAY_100,
    },
    container: {
        width: '100%',
        flexDirection: 'column',
        paddingHorizontal: 11,
        paddingVertical: 16,
        gap: 10,
    },
    roomInfoWrap: {
        width: '100%',
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
    },
    thumbnail: {
        width: 56,
        height: 56,
        borderRadius: 999,
        backgroundColor: colors.GRAY_200,
    },
    roomInfo: {
        flexDirection: 'column',
        gap: 3,
    },
    title: {
        fontSize: 15,
        lineHeight: 22,
        letterSpacing: 0.15,
        color: colors.GRAY_600,
        fontWeight: '500',
    },
    infoTagRow : {
        flexDirection: 'row',
        gap: 4,
    },
    tag: {
        fontSize: 12,
        fontWeight: '400',
        letterSpacing: 0.2,
        lineHeight: 20,
        color: colors.BLUE_500,
        marginBottom:4,
    },
    content: {
        fontSize: 14,
        fontWeight: '400',
        letterSpacing: 0.2,
        lineHeight: 20,
        color: colors.GRAY_500,
        marginBottom:4,
    },
    memberInfo: {
        flexDirection: 'row',
        gap: 6,
    },
    numWrap: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    seeIcon: {
        width: 18,
        height: 18,
    },
    seeNum: {
        fontSize: 11,
        fontWeight: '400',
        letterSpacing: 0.35,
        lineHeight: 14,
        color: colors.GRAY_300,
        marginBottom:4,
    },
    imgWrap: {
        position: 'relative',
    },
    profileFirst: {
        width: 19,
        height: 19,
        borderRadius: 999,
        backgroundColor: colors.GRAY_200,
    },
    profileLast: {
        width: 19,
        height: 19,
        borderRadius: 999,
        backgroundColor: colors.GRAY_300,
    },
});

