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
import {StackNavigationProp} from '@react-navigation/stack';
import {HarmonyStackParamList} from '@/navigations/stack/HarmonyStackNavigator';
import YouTubeEmbed from '@/components/YouTubeEmbed';
import {colors} from '@/constants';
import {HarmonyRoomInfo} from '@/constants/types';

type NavigationProp = StackNavigationProp<HarmonyStackParamList>;

type Props = {
  data: HarmonyRoomInfo;
  index: number;
};

export default function HarmonyRoomCard({data, index}:Props){
    const navigation = useNavigation<NavigationProp>();

    const {title,tags, seeNum, createdAgo, mediaURL } = data;
    const isLeft = index % 2 === 0;

//     const handlePress = () => {
//         navigation.navigate(ha.POST_PAGE, {
//           postId: postID,
//         });
//       };

    const getYouTubeThumbnail = (url: string): string => {
        const videoIdMatch = url.match(
          /(?:youtu\.be\/|v=)([a-zA-Z0-9_-]{11})/
        );
        const videoId = videoIdMatch?.[1];
        return videoId
          ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
          : '';
      };

    const thumbnail = getYouTubeThumbnail(mediaURL);

    return (
        <TouchableOpacity
            style={[styles.card, {marginRight: isLeft ? 10 : 0}]}
//             onPress={handlePress}
            activeOpacity={0.85}>
            {/* 썸네일 */}
            <View style={styles.thumbnailWrapper}>
                <Image source={{uri: thumbnail}} style={styles.thumbnail} />
            </View>

            {/* 하모니룸 정보 */}
            <View style={styles.infoRow}>
                <Text style={styles.title} numberOfLines={1}>
                   {title}
                </Text>
                <View style={styles.infoTagRow}>
                    <Text style={styles.tag} numberOfLines={1}>
                        {tags.map(tag => `#${tag}`).join(' ')}
                    </Text>
                </View>
                <View style={styles.infoWrap}>
                    <View style={styles.numWrap}>
                        <Image source={require('@/assets/icons/harmonyRoom/FollowIcon.png')} style={styles.seeIcon}/>
                        <Text style={styles.seeNum}>{seeNum}</Text>
                    </View>
                    <Text style={styles.time}>{createdAgo}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    marginBottom:20,
  },
  thumbnailWrapper: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  infoRow: {
    flexDirection: 'column',
    alignItems: 'start',
    marginTop: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.GRAY_600,
    marginBottom:4,
  },
  infoTagRow : {
      flexDirection: 'row',
      gap: 4,
      },
  tag: {
      fontSize: 12,
      fontWeight: '400',
      color: colors.BLUE_500,
      marginBottom:4,
  },
  infoWrap : {
      width:'100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
  },
  seeIcon: {
      width:24,
      height:24,
      },
  numWrap : {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
  seeNum: {
      fontSize: 12,
      lineHeight:16,
      color: colors.GRAY_300,
      },
  time: {
    fontSize: 12,
    lineHeight:16,
    color: colors.GRAY_300,
  },
});