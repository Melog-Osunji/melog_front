import React, {createContext, useContext, useState, ReactNode} from 'react';
import {PostWithUserDTO} from '@/types';
// import {mockPosts} from '@/constants/dummyData';

interface PostContextType {
  posts: PostWithUserDTO[]; // 포스트 배열
  addPost: (post: PostWithUserDTO) => void; // 포스트 추가 함수
  removePost: (postId: string) => void; // 포스트 삭제 함수
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const usePostContext = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePostContext must be used within a PostProvider');
  }
  return context;
};

interface PostProviderProps {
  children: ReactNode;
}

export const PostProvider: React.FC<PostProviderProps> = ({children}) => {
  const [posts, setPosts] = useState<PostWithUserDTO[]>([]);

  const addPost = (post: PostWithUserDTO) => {
    setPosts(prevPosts => [post, ...prevPosts]); // 새 포스트를 맨 앞에 추가
  };

  const removePost = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.filter(postWithUser => postWithUser.post.id !== postId),
    );
  };

  return (
    <PostContext.Provider value={{posts, addPost, removePost}}>
      {children}
    </PostContext.Provider>
  );
};
