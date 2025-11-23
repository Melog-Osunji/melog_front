import React, {useState} from 'react';
import {Image, Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {colors} from '@/constants';
import {PostDTO, UserDTO} from '@/types';
import {useAuthContext} from '@/contexts/AuthContext';
//components
import YouTubeEmbed from '@/components/common/YouTubeEmbed';
import PostStats from '@/components/post/PostStats';
import PostOptionsSheet from '@/components/post/PostOptionsSheet';
import PostOptionsBtn from '@/components/post/PostOptionsBtn';
import {useDeletePost} from '@/hooks/queries/post/usePostMutations';
import CheckPopup from '@/components/common/CheckPopup';
//navigation
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {PostStackParamList} from '@/navigations/stack/PostStackNavigator';
import {
  postNavigations,
  myPageNavigations,
  harmonyNavigations,
} from '@/constants';
import {showToast} from '../common/ToastService';

type PostCardNavigationProp = StackNavigationProp<PostStackParamList>;

type PostCardProps = {
  post: PostDTO;
  user: UserDTO;
};

function PostCard({post, user}: PostCardProps) {
  const {user: authUser} = useAuthContext();
  //navigation
  const navigation = useNavigation<PostCardNavigationProp>();
  const deletePostMutation = useDeletePost();

  // confirm modal visible state
  const [confirmVisible, setConfirmVisible] = useState(false);

  const handlePostDelete = (postId: string) => {
    deletePostMutation.mutate(postId, {
      onSuccess: () => {
        console.log('[PostCard] post deleted:', postId);
        showToast('포스트가 삭제되었습니다.', 'success');
      },
      onError: () => {
        showToast('포스트 삭제에 실패했습니다.', 'error');
      },
    });
  };

  const handlePress = () => {
    const routes = navigation.getState()?.routeNames ?? [];

    if (routes.includes(myPageNavigations.MYPAGE_HOME)) {
      // ✅ 마이페이지 스택 내에 있으면
      navigation.navigate('MYPAGE_POST_PAGE', {postId: post.id});
    } else if (routes.includes(harmonyNavigations.HARMONY_HOME)) {
      // ✅ 하모니룸 스택 내에 있으면
      //       navigation.navigate('HARMONY_POST_PAGE', { postId: post.id });
    } else {
      // ✅ 그 외엔 기본 포스트 페이지로 이동
      navigation.navigate(postNavigations.POST_PAGE, {postId: post.id});
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.card}
        onPress={handlePress}
        activeOpacity={0.9}
        delayPressIn={0}>
        {/* 사용자 정보 */}
        <View style={styles.header}>
          <View style={styles.userWrapper}>
            <Image
              source={
                user?.profileImg
                  ? {uri: user.profileImg}
                  : require('@/assets/icons/common/EmptyProfile.png')
              }
              style={styles.profileImage}
            />
            <View style={styles.userInfo}>
              <Text style={styles.nickName}>{user.nickName}</Text>
              {post.createdAgo && (
                <Text style={styles.timeText}>{post.createdAgo}</Text>
              )}
            </View>
          </View>
          {authUser?.nickName === user.nickName ? (
            // onPress opens confirm popup; actual deletion runs when popup "삭제" pressed
            <PostOptionsBtn onPress={() => setConfirmVisible(true)} />
          ) : (
            <PostOptionsSheet user={user} postId={post.id} />
          )}
        </View>

        {/* 본문 */}
        <Text style={styles.content}>{post.content}</Text>

        {/* 태그 */}
        <View style={styles.tags}>
          {post.tags.map((tag, index) => (
            <Text key={index} style={styles.tag}>
              #{tag}
            </Text>
          ))}
        </View>

        {/* 유튜브 영상 */}
        {post.mediaUrl &&
          (post.mediaUrl.includes('youtube.com') ||
            post.mediaUrl.includes('youtu.be')) && (
            <YouTubeEmbed url={post.mediaUrl} />
          )}

        {/* 상태바 */}
        <PostStats
          id={post.id}
          likeCount={post.likeCount}
          commentCount={post.commentCount}
        />

        {/* 베스트 댓글 */}
        {post.bestComment && (
          <View style={styles.bestCommentContainer}>
            <Image
              source={{uri: post.bestComment.profileImg}}
              style={styles.bestCommentProfileImage}
            />
            <Text
              style={styles.bestCommentContent}
              numberOfLines={1}
              ellipsizeMode="tail">
              {post.bestComment.content}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* 삭제 확인 팝업 */}
      <CheckPopup
        visible={confirmVisible}
        onClose={() => {
          setConfirmVisible(false);
          handlePostDelete(post.id);
        }}
        onExit={() => {
          setConfirmVisible(false);
        }}
        iconImg={require('@/assets/icons/common/error_red.png')}
        title={'이 피드를 삭제할까요?'}
        leftBtnColor={colors.GRAY_50}
        rightBtnColor={colors.WHITE}
        leftBtnTextColor={colors.GRAY_500}
        rightBtnTextColor={colors.ERROR_RED}
        leftBtnText={'취소'}
        rightBtnText={'삭제'}
        rightBtnBorderColor={colors.ERROR_RED}
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  header: {
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
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.BLACK,
  },
  timeText: {
    color: '#888',
    fontSize: 12,
  },
  content: {
    fontSize: 14,
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
  bestCommentContainer: {
    backgroundColor: '#F5F7F8',
    borderRadius: 8,
    padding: 12,
    paddingTop: 14,
    paddingBottom: 12,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bestCommentProfileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  bestCommentLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.GRAY_500,
    lineHeight: 16,
  },
  bestCommentContent: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    color: colors.BLACK,
    lineHeight: 20,
    marginLeft: 8,
  },
});

export default PostCard;
