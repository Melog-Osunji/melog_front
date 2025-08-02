import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {RouteProp, useRoute, useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import PostStats from '@/components/post/PostStats';
import {colors, Post, mockPosts, mockComments} from '@/constants';
import axiosInstance from '@/api/axiosInstance';
import {useHideTabBarOnFocus} from '@/utils/roadBottomNavigationBar';
import LikeAndComment from '@/components/post/CommentBar';
import {PostStackParamList} from '@/navigations/stack/PostStackNavigator';
import {postNavigations} from '@/constants';
import YouTubeEmbed2 from '@/components/common/YouTubeEmbed2';
import CommentList from '@/components/post/CommentList';
import CustomButton from '@/components/common/CustomButton';
import IconButton from '@/components/common/IconButton';

// 네비게이션 param 타입 정의
type PostPageScreenRouteProp = RouteProp<
  PostStackParamList,
  typeof postNavigations.POST_PAGE
>;

// 커스텀 헤더 컴포넌트
const PostPageHeader = () => {
  return (
    <View style={headerStyles.container}>
      <IconButton
        imageSource={require('@/assets/icons/post/BackArrow.png')}
        target={'goBack'}
        size={24}
      />

      <View style={headerStyles.rightButtons}>
        <IconButton
          imageSource={require('@/assets/icons/post/Search.png')}
          size={32}
        />
        <IconButton
          imageSource={require('@/assets/icons/post/Info.png')}
          size={32}
        />
      </View>
    </View>
  );
};

function PostPageScreen() {
  const route = useRoute<PostPageScreenRouteProp>();
  const {postId, postData} = route.params;

  const [post, setPost] = useState<Post | null>(postData || null);
  const [loading, setLoading] = useState(!postData);
  const [comments, setComments] = useState(mockComments);

  useHideTabBarOnFocus();

  // 댓글 추가 함수
  const handleAddComment = (commentText: string) => {
    const newComment = {
      id: `comment${Date.now()}`,
      userId: 'current_user',
      userName: '홍길동',
      userProfileImg: '',
      content: commentText,
      createdAgo: 0,
      likeCount: 0,
      commentCount: 0,
      replies: [],
    };

    setComments(prev => [...prev, newComment]);

    // 포스트의 댓글 카운트도 업데이트
    if (post) {
      setPost({...post, commentCount: post.commentCount + 1});
    }
  };

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
            // 백엔드 데이터를 Post 타입으로 직접 설정
            setPost(res.data.response);
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
      <PostPageHeader />
      <ScrollView
        style={{flex: 1}}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 100}}>
        {/* 미디어 - 화면 전체 너비 사용 */}
        {post.mediaUrl && (
          <>
            {post.mediaUrl.includes('youtube.com') ||
            post.mediaUrl.includes('youtu.be') ? (
              <YouTubeEmbed2 url={post.mediaUrl} borderRadius={0} />
            ) : (
              <Image
                source={{uri: post.mediaUrl}}
                style={styles.fullWidthImage}
              />
            )}
          </>
        )}

        <View style={styles.postContainer}>
          {/* 사용자 정보 */}
          <View style={styles.userSection}>
            <View style={styles.userWrapper}>
              <Image
                source={{uri: post.user.profileImg}}
                style={styles.profileImage}
              />
              <View style={styles.userInfo}>
                <Text style={styles.nickName}>{post.user.nickName}</Text>
                <Text style={styles.timeText}>{post.createdAgo}시간 전</Text>
              </View>
            </View>
            <CustomButton label="팔로우" variant="filled" size="small" />
          </View>

          {/* 본문 */}
          <Text style={styles.content}>{post.content}</Text>

          {/* 태그 */}
          <View style={styles.tags}>
            {(post.tags ?? []).map((tag, index) => (
              <Text key={index} style={styles.tag}>
                #{tag}
              </Text>
            ))}
          </View>

          {/* 통계 */}
          <PostStats
            likeCount={post.likeCount}
            commentCount={post.commentCount}
          />
        </View>

        {/* 댓글 섹션 */}
        <CommentList
          comments={comments}
          totalCommentCount={post.commentCount}
        />
      </ScrollView>

      <LikeAndComment onSend={handleAddComment} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.WHITE,
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
  },
  postContainer: {
    backgroundColor: colors.WHITE,
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY_200,
  },
  userSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  userInfo: {
    color: colors.BLACK,
    marginLeft: 8,
  },
  nickName: {
    fontWeight: 'bold',
    color: colors.BLACK,
  },
  timeText: {
    color: '#888',
    fontSize: 12,
  },
  title: {
    color: colors.BLACK,
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.BLACK,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    marginRight: 8,
    color: colors.BLUE_600,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  fullWidthImage: {
    width: '100%',
    height: 200,
  },
});

const headerStyles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY_100,
    backgroundColor: colors.WHITE,
  },
  leftButton: {
    padding: 8,
  },
  rightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    width: 32,
    height: 32,
  },
});

export default PostPageScreen;
