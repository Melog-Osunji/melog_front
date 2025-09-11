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
import {PostStackParamList} from '@/navigations/stack/PostStackNavigator';
import YouTubeEmbed from '@/components/YouTubeEmbed';
import {PopularMedia} from '@/constants/types';
import {postNavigations} from '@/constants';
import {colors} from '@/constants';

type NavigationProp = StackNavigationProp<PostStackParamList>;

type Props = {
  data: PopularMedia;
};

export default function PopularMediaCard({data}: Props) {
  const navigation = useNavigation<NavigationProp>();

  const {userNickname, userProfileImgLink, postID, mediaURL, createdAgo} = data;

  const handlePress = () => {
    navigation.navigate(postNavigations.POST_PAGE, {
      postId: postID,
    });
  };

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
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.85}>
      {/* 썸네일 */}
        <View style={styles.thumbnailWrapper}>
          <Image source={{uri: thumbnail}} style={styles.thumbnail} />
          <View style={styles.playOverlay}>
            <Image
              source={require('@/assets/icons/post/PlayButton.png')}
              style={styles.playIcon}
            />
          </View>
        </View>

      {/* 사용자 정보 */}
      <View style={styles.userRow}>
        <Image source={{uri: userProfileImgLink}} style={styles.avatar} />
        <View style={styles.userText}>
          <Text style={styles.nickname} numberOfLines={1}>
            {userNickname}
          </Text>
          <Text style={styles.date}>{createdAgo}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 140,
  },
  thumbnailWrapper: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  youtubeIcon: {
    width: 20,
    height: 14,
    position: 'absolute',
    top: 8,
    left: 8,
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    opacity: 0.8,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 9,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 50,
    marginRight: 8,
  },
  userText: {
    flexShrink: 1,
  },
  nickname: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.GRAY_600,
    marginBottom:2,
  },
  date: {
    fontSize: 12,
    color: colors.GRAY_200,
  },
});