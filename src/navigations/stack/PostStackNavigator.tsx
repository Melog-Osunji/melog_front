import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import PostHomeScreen from '@/screens/post/PostHomeScreen';
import PostPageScreen from '@/screens/post/PostPageScreen';
import PostCreateScreen from '@/screens/post/PostCreateScreen';
import PostSearchScreen from '@/screens/post/PostSearchScreen';
import PostSearchResultScreen from '@/screens/post/PostSearchResultScreen';

import {postNavigations} from '@/constants';
import {PostProvider} from '@/contexts/PostContext';

export type PostStackParamList = {
  [postNavigations.POST_HOME]: undefined;
  [postNavigations.POST_PAGE]: {postId: string;};
  [postNavigations.POST_CREATE]: undefined;
  [postNavigations.POST_SEARCH]: undefined;
  [postNavigations.POST_SEARCH_RESULT]: {searchKeyword: string};
};

const Stack = createStackNavigator<PostStackParamList>();

function MainStackNavigator() {
  return (
    <PostProvider>
      <Stack.Navigator>
        <Stack.Screen
          name={postNavigations.POST_HOME}
          component={PostHomeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={postNavigations.POST_PAGE}
          component={PostPageScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={postNavigations.POST_CREATE}
          component={PostCreateScreen}
          options={{headerShown: false, title: ' '}}
        />
        <Stack.Screen
          name={postNavigations.POST_SEARCH}
          component={PostSearchScreen}
          options={{headerShown: false, title: ' '}}
        />
        <Stack.Screen
          name={postNavigations.POST_SEARCH_RESULT}
          component={PostSearchResultScreen}
          options={{headerShown: false, title: ' '}}
        />
      </Stack.Navigator>
    </PostProvider>
  );
}

export default MainStackNavigator;
