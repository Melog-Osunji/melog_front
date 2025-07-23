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
import PostStats from '@/components/PostStats';
import {colors, Post} from '@/constants';
import axiosInstance from '@/api/axiosInstance';
import {useHideTabBarOnFocus} from '@/utils/roadBottomNavigationBar';
import LikeAndComment from '@/components/LikeAndComment';

// 네비게이션 param 타입 정의
type PostPageScreenRouteProp = RouteProp<
  {PostPage: {postId: number}},
  'PostPage'
>;

function mapBackendPostToPost(backendPost: any): Post {
  return {
    id: backendPost.id,
    title: backendPost.title,
    content: backendPost.content ?? '',
    tags: backendPost.category ? [backendPost.category] : [],
    imageUrl: backendPost.imageUrls?.[0] ?? undefined,
    likes: backendPost.likeCount,
    comments: backendPost.commentCount ?? 0,
    views: backendPost.viewCount,
  };
}

function PostPageScreen() {
  const route = useRoute<PostPageScreenRouteProp>();
  const {postId} = route.params;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useHideTabBarOnFocus();

  useEffect(() => {
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
  }, [postId]);

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
        <Text style={styles.title}>{post.title}</Text>
        {post.imageUrl && (
          <Image source={{uri: post.imageUrl}} style={styles.image} />
        )}
        <Text style={styles.content}>{post.content}</Text>
        <View style={styles.tagsContainer}>
          {(post.tags ?? []).map(tag => (
            <Text key={tag} style={styles.tag}>
              {tag}
            </Text>
          ))}
        </View>
        <PostStats
          likes={post.likes}
          comments={post.comments}
          views={post.views}
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
