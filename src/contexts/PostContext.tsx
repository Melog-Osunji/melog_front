import React, {createContext, useContext, useState, ReactNode} from 'react';
import {Post, mockPosts} from '@/constants/types';

interface PostContextType {
  posts: Post[];
  addPost: (post: Post) => void;
  removePost: (postId: string) => void;
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
  const [posts, setPosts] = useState<Post[]>(mockPosts); // 초기값으로 mockPosts 사용

  const addPost = (post: Post) => {
    setPosts(prevPosts => [post, ...prevPosts]); // 새 포스트를 맨 앞에 추가
  };

  const removePost = (postId: string) => {
    setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
  };

  return (
    <PostContext.Provider value={{posts, addPost, removePost}}>
      {children}
    </PostContext.Provider>
  );
};
