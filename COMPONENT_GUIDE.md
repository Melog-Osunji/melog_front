# MELOG 컴포넌트 사용 가이드 - 클래식 음악 커뮤니티

## 🎼 프로젝트 소개

**MELOG**는 클래식 음악을 사랑하는 사람들을 위한 커뮤니티 플랫폼입니다.

## 📱 공통 컴포넌트

### CustomButton

재사용 가능한 버튼 컴포넌트입니다.

#### Props
```typescript
interface CustomButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
}
```

#### 사용 예시
```tsx
import CustomButton from '@/components/CustomButton';

// 기본 사용법
<CustomButton 
  title="확인" 
  onPress={() => console.log('버튼 클릭')} 
/>

// 다양한 옵션
<CustomButton 
  title="로딩 중..."
  onPress={handleSubmit}
  variant="primary"
  size="large"
  loading={isLoading}
  disabled={!isFormValid}
/>
```

### CustomHeader

화면 상단의 공통 헤더 컴포넌트입니다.

#### Props
```typescript
interface CustomHeaderProps {
  text: string;
  iconSource?: ImageSourcePropType;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
}
```

#### 사용 예시
```tsx
import CustomHeader from '@/components/CustomHeader';

// 기본 헤더
<CustomHeader text="청마루" />

// 아이콘과 함께
<CustomHeader 
  text="게시글" 
  iconSource={require('@/assets/icons/post.png')}
  onBackPress={() => navigation.goBack()}
/>

// 우측 컴포넌트 추가
<CustomHeader 
  text="설정"
  rightComponent={
    <TouchableOpacity onPress={handleSettings}>
      <Text>저장</Text>
    </TouchableOpacity>
  }
/>
```

### InputField

텍스트 입력 필드 컴포넌트입니다.

#### Props
```typescript
interface InputFieldProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  multiline?: boolean;
  error?: string;
  disabled?: boolean;
}
```

#### 사용 예시
```tsx
import InputField from '@/components/InputField';

const [title, setTitle] = useState('');
const [content, setContent] = useState('');

<InputField
  placeholder="제목을 입력하세요"
  value={title}
  onChangeText={setTitle}
  error={titleError}
/>

<InputField
  placeholder="내용을 입력하세요"
  value={content}
  onChangeText={setContent}
  multiline
/>
```

## 🗺 연주회장/콘서트홀 관련 컴포넌트

### GoogleMapView

연주회장과 콘서트홀의 위치를 표시하는 지도 컴포넌트입니다.

#### Props
```typescript
interface GoogleMapViewProps {
  location: {
    latitude: number;
    longitude: number;
  };
  venues?: VenueType[];
  onVenuePress?: (venue: VenueType) => void;
  showUserLocation?: boolean;
  zoomEnabled?: boolean;
}
```

#### 사용 예시
```tsx
import GoogleMapView from '@/components/GoogleMapView';

const venues = [
  {
    id: 1,
    latitude: 37.4781,
    longitude: 127.0117,
    name: "예술의전당 콘서트홀",
    address: "서울특별시 서초구 남부순환로 2406",
    type: "concert_hall"
  }
];

<GoogleMapView
  location={{
    latitude: 37.4781,
    longitude: 127.0117
  }}
  venues={venues}
  onVenuePress={(venue) => {
    navigation.navigate('VenueInfo', { venueId: venue.id });
  }}
  showUserLocation
/>
```

### ConcertMapView

연주회 정보와 함께 지도를 표시하는 컴포넌트입니다.

#### Props
```typescript
interface ConcertMapViewProps {
  concerts: ConcertType[];
  selectedDate?: Date;
  onConcertPress?: (concert: ConcertType) => void;
}
```

## 📝 게시판 관련 컴포넌트

### PostListItem

게시글 목록에서 사용하는 아이템 컴포넌트입니다.

#### Props
```typescript
interface PostListItemProps {
  post: Post;
  onPress: (post: Post) => void;
}

interface Post {
  id: number;
  title: string;
  content: string;
  categoryName: string;
  authorName: string;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  createdAt: string;
}
```

#### 사용 예시
```tsx
import PostListItem from '@/components/PostListItem';

const posts = [
  {
    id: 1,
    title: "청주 맛집 추천",
    content: "청주에서 가장 맛있는 곳들을...",
    categoryName: "자유",
    authorName: "사용자1",
    likeCount: 15,
    commentCount: 3,
    viewCount: 120,
    createdAt: "2024-01-15T10:30:00Z"
  }
];

{posts.map(post => (
  <PostListItem
    key={post.id}
    post={post}
    onPress={(post) => {
      navigation.navigate('PostPage', { postId: post.id });
    }}
  />
))}
```

### PostStats

게시글 통계(좋아요, 댓글, 조회수)를 표시하는 컴포넌트입니다.

#### Props
```typescript
interface PostStatsProps {
  likes: number;
  comments: number;
  views: number;
}
```

#### 사용 예시
```tsx
import PostStats from '@/components/PostStats';

<PostStats
  likes={15}
  comments={3}
  views={120}
/>
```

### LikeAndComment

좋아요와 댓글 버튼을 제공하는 컴포넌트입니다.

#### Props
```typescript
interface LikeAndCommentProps {
  postId: number;
  isLiked: boolean;
  likeCount: number;
  onLikePress: () => void;
  onCommentPress: () => void;
}
```

#### 사용 예시
```tsx
import LikeAndComment from '@/components/LikeAndComment';

<LikeAndComment
  postId={1}
  isLiked={false}
  likeCount={15}
  onLikePress={() => toggleLike(postId)}
  onCommentPress={() => setShowComments(true)}
/>
```

## 🔐 인증 관련 컴포넌트

### KakaoLoginButton

카카오 로그인 버튼 컴포넌트입니다.

#### Props
```typescript
interface KakaoLoginButtonProps {
  onSuccess?: (tokens: AuthTokens) => void;
  onError?: (error: Error) => void;
}
```

#### 사용 예시
```tsx
import KakaoLoginButton from '@/components/KakaoLoginButton';

<KakaoLoginButton
  onSuccess={(tokens) => {
    // 로그인 성공 처리
    console.log('로그인 성공:', tokens);
  }}
  onError={(error) => {
    // 에러 처리
    console.error('로그인 실패:', error);
  }}
/>
```

## 🎨 스타일 가이드

### 색상 사용법
```tsx
import { colors } from '@/constants';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.WHITE,
    borderColor: colors.GRAY_400,
  },
  primaryButton: {
    backgroundColor: colors.PRIMARY_500,
  },
  errorText: {
    color: colors.ERROR,
  },
});
```

### 타이포그래피
```tsx
const styles = StyleSheet.create({
  h1: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.BLACK,
  },
  h2: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.BLACK,
  },
  body: {
    fontSize: 16,
    color: colors.GRAY_800,
  },
  caption: {
    fontSize: 12,
    color: colors.GRAY_600,
  },
});
```

## 📏 레이아웃 가이드

### 안전 영역 사용
```tsx
import { SafeAreaView } from 'react-native-safe-area-context';

function MyScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* 콘텐츠 */}
    </SafeAreaView>
  );
}
```

### 공통 스페이싱
```tsx
const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    marginVertical: spacing.sm,
  },
});
```

## 🔄 커스텀 훅 사용법

### useForm

폼 상태 관리를 위한 훅입니다.

```tsx
import { useForm } from '@/hooks/useForm';

function PostCreateScreen() {
  const { values, errors, handleChange, handleSubmit } = useForm({
    initialValues: {
      title: '',
      content: '',
      categoryId: 1,
    },
    validationSchema: {
      title: (value) => value.length > 0 ? null : '제목을 입력하세요',
      content: (value) => value.length > 0 ? null : '내용을 입력하세요',
    },
    onSubmit: (values) => {
      // 제출 로직
      createPost(values);
    },
  });

  return (
    <View>
      <InputField
        placeholder="제목"
        value={values.title}
        onChangeText={(text) => handleChange('title', text)}
        error={errors.title}
      />
      <CustomButton
        title="작성하기"
        onPress={handleSubmit}
      />
    </View>
  );
}
```

### useUserLocation

사용자 위치를 가져오는 훅입니다.

```tsx
import { useUserLocation } from '@/hooks/useUserLocation';

function MapScreen() {
  const { userLocation, isUserLocationError, requestLocation } = useUserLocation();

  useEffect(() => {
    requestLocation();
  }, []);

  if (isUserLocationError) {
    return <Text>위치 권한을 허용해주세요.</Text>;
  }

  return (
    <GoogleMapView
      location={userLocation}
      showUserLocation
    />
  );
}
```

## 🔗 네비게이션 사용법

### 타입 안전한 네비게이션
```tsx
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { PostStackParamList } from '@/navigations/stack/PostStackNavigator';

function PostHomeScreen() {
  const navigation = useNavigation<NavigationProp<PostStackParamList>>();

  const handlePostPress = (postId: number) => {
    navigation.navigate('PostPage', { postId });
  };

  return (
    // 화면 내용
  );
}
```

### 파라미터 받기
```tsx
import { useRoute, RouteProp } from '@react-navigation/native';

type PostPageRouteProp = RouteProp<PostStackParamList, 'PostPage'>;

function PostPageScreen() {
  const route = useRoute<PostPageRouteProp>();
  const { postId } = route.params;

  // postId 사용
}
```

## 🚨 에러 처리

### 에러 바운더리 사용
```tsx
import { ErrorBoundary } from '@/components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <MyComponent />
    </ErrorBoundary>
  );
}
```

### API 에러 처리
```tsx
import { useState } from 'react';
import { Alert } from 'react-native';

function MyComponent() {
  const [loading, setLoading] = useState(false);

  const handleApiCall = async () => {
    try {
      setLoading(true);
      const result = await apiFunction();
      // 성공 처리
    } catch (error) {
      console.error('API 에러:', error);
      Alert.alert('오류', '데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };
}
```

## 🎯 베스트 프랙티스

### 1. 컴포넌트 구조
```tsx
// 좋은 예시
interface Props {
  title: string;
  onPress: () => void;
}

const MyComponent: React.FC<Props> = ({ title, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
};

export default MyComponent;
```

### 2. 스타일 분리
```tsx
// 컴포넌트 파일과 분리
import { styles } from './MyComponent.styles';

// 또는 파일 하단에 정의
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
```

### 3. 메모이제이션 활용
```tsx
import { useMemo, useCallback } from 'react';

const MyComponent = ({ data, onItemPress }) => {
  const filteredData = useMemo(() => {
    return data.filter(item => item.isActive);
  }, [data]);

  const handlePress = useCallback((item) => {
    onItemPress(item);
  }, [onItemPress]);

  return (
    // 렌더링 로직
  );
};
```

---

이 가이드를 참고하여 일관성 있고 재사용 가능한 컴포넌트를 개발하세요! 🚀
