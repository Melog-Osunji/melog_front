import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import {colors, postNavigations} from '@/constants';
import {SafeAreaView} from 'react-native-safe-area-context';
import PostListItem from '@/components/PostListItem';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import axiosInstance from '@/api/axiosInstance';
import {Post} from '@/constants/types';
import {ScrollView} from 'react-native-gesture-handler';
import {StackScreenProps} from '@react-navigation/stack';
import {PostStackParamList} from '@/navigations/stack/PostStackNavigator';

import CustomButton from '@/components/CustomButton';

type IntroScreenProps = StackScreenProps<
  PostStackParamList,
  typeof postNavigations.POST_HOME
>;

// function mapBackendPostToPost(backendPost: any): Post {
//   return {
//     id: backendPost.id,
//     title: backendPost.title,
//     content: backendPost.content,
//     tags: backendPost.category ? [backendPost.category] : [],
//     imageUrl: '', // 필요시 매핑
//     likes: backendPost.likeCount,
//     comments: backendPost.commentCount,
//     views: backendPost.viewCount,
//     // author, category, createdAt 등 필요시 타입/컴포넌트에 추가
//   };
// }

function PostHomeScreen({navigation}: IntroScreenProps) {
  // const navigation = useNavigation<any>();
  // const [posts, setPosts] = useState<any[]>([]);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     const fetchPosts = async () => {
  //       try {
  //         const res = await axiosInstance.get('/api/posts');
  //         if (res.data.success) {
  //           console.log('게시글 전체 조회 성공:', res.data.response);
  //           setPosts(res.data.response.map(mapBackendPostToPost));
  //         } else {
  //           console.log('게시글 불러오기 실패:', res.data.error?.message);
  //         }
  //       } catch (error) {
  //         console.error('게시글 불러오기 에러:', error);
  //       }
  //     };
  //     fetchPosts();
  //   }, []),
  // );

  return (
    <SafeAreaView style={styles.container}>
      <Text>post_home</Text>
      <CustomButton
        label="다음"
        onPress={() => navigation.navigate(postNavigations.POST_SEARCH)}
        size="medium"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PostHomeScreen;
