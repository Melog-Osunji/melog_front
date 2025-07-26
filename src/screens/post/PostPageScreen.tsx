import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import PostStats from '@/components/post/PostStats';
import {colors, Post, mockPosts} from '@/constants';
import axiosInstance from '@/api/axiosInstance';
import {useHideTabBarOnFocus} from '@/utils/roadBottomNavigationBar';
import LikeAndComment from '@/components/LikeAndComment';
import {PostStackParamList} from '@/navigations/stack/PostStackNavigator';
import {postNavigations} from '@/constants';
import YouTubeEmbed from '@/components/YouTubeEmbed';

// 네비게이션 param 타입 정의
type PostPageScreenRouteProp = RouteProp<
  PostStackParamList,
  typeof postNavigations.POST_PAGE
>;

function mapBackendPostToPost(backendPost: any): Post {
  return {
    id: backendPost.id,
    userId: backendPost.userId || '',
    title: backendPost.title,
    content: backendPost.content ?? '',
    mediaType: backendPost.mediaType || '',
    mediaUrl: backendPost.mediaUrl,
    createdAgo: backendPost.createdAgo || 0,
    likeCount: backendPost.likeCount || 0,
    commentCount: backendPost.commentCount || 0,
    tags: backendPost.category
      ? [backendPost.category]
      : backendPost.tags || [],
    user: backendPost.user || {
      nickName: 'Unknown',
      profileImg: '',
    },
  };
}

function PostPageScreen() {
  const route = useRoute<PostPageScreenRouteProp>();
  const {postId, postData} = route.params;

  const [post, setPost] = useState<Post | null>(postData || null);
  const [loading, setLoading] = useState(!postData);

  useHideTabBarOnFocus();

  useEffect(() => {
    // postData가 있으면 API 호출을 하지 않음 (즉시 표시)
    if (postData) {
      setLoading(false);
      return;
    }

    // 더미데이터에서 postId에 해당하는 포스트 찾기
    const foundPost = mockPosts.find(mockPost => mockPost.id === postId);

    if (foundPost) {
      // 더미데이터를 사용
      setPost(foundPost);
      setLoading(false);
    } else {
      // 더미데이터에 없으면 API 호출
      const fetchPost = async () => {
        try {
          const res = await axiosInstance.get(`/api/posts/${postId}`);
          if (res.data.success) {
            console.log('res.data', res.data);
            setPost(mapBackendPostToPost(res.data.response));
          } else {
            setPost(null);
          }
        } catch (e) {
          setPost(null);
        } finally {
          setLoading(false);
        }
      };
      fetchPost();
    }
  }, [postId, postData]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={colors.BLUE_400} />
      </SafeAreaView>
    );
  }

  if (!post) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>게시글을 찾을 수 없습니다.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* 사용자 정보 */}
        <View style={styles.userSection}>
          <Image
            source={{uri: post.user.profileImg}}
            style={styles.profileImage}
          />
          <View style={styles.userInfo}>
            <Text style={styles.nickName}>{post.user.nickName}</Text>
            <Text style={styles.timeText}>{post.createdAgo}시간 전</Text>
          </View>
        </View>

        {/* 제목 */}
        <Text style={styles.title}>{post.title}</Text>

        {/* 본문 */}
        <Text style={styles.content}>{post.content}</Text>

        {/* 태그 */}
        <View style={styles.tagsContainer}>
          {(post.tags ?? []).map((tag, index) => (
            <Text key={index} style={styles.tag}>
              #{tag}
            </Text>
          ))}
        </View>

        {/* 미디어 */}
        {post.mediaUrl && (
          <>
            {post.mediaUrl.includes('youtube.com') ||
            post.mediaUrl.includes('youtu.be') ? (
              <YouTubeEmbed url={post.mediaUrl} />
            ) : (
              <Image source={{uri: post.mediaUrl}} style={styles.image} />
            )}
          </>
        )}

        {/* 통계 */}
        <PostStats
          likeCount={post.likeCount}
          commentCount={post.commentCount}
        />
      </ScrollView>
      <LikeAndComment />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
    padding: 24,
    flexDirection: 'column',
    gap: 20,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userInfo: {
    marginLeft: 12,
  },
  nickName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: colors.BLACK,
  },
  timeText: {
    color: colors.GRAY_500,
    fontSize: 12,
    marginTop: 2,
  },
  header: {},
  title: {
    color: colors.BLACK,
    fontSize: 24,
    fontWeight: 'bold',
  },
  tagsContainer: {flexDirection: 'row'},
  tag: {
    borderColor: '#2196f3',
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 8,
    fontSize: 12,
    color: '#2196f3',
    marginRight: 6,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  content: {fontSize: 16, color: colors.BLACK},
  stat: {fontSize: 14, color: '#555', marginRight: 16},
});

export default PostPageScreen;
