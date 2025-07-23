# MELOG Frontend 개발 환경 설정 가이드

## 🎼 프로젝트 소개

**MELOG**는 클래식 음악을 사랑하는 사람들을 위한 커뮤니티 플랫폼입니다.
- 클래식 음악 관련 정보 공유 및 토론
- 연주회/콘서트 정보 및 후기 공유  
- 클래식 음악 애호가들 간의 소통과 교류

## 🔧 개발 환경 준비

### 1. Node.js 설치
- Node.js 16 이상 버전 설치
- npm 또는 yarn 패키지 매니저

### 2. React Native 개발 환경
```bash
# React Native CLI 설치
npm install -g react-native-cli

# Watchman 설치 (macOS)
brew install watchman
```

### 3. Android 개발 환경
- **Android Studio** 설치
- **Android SDK** 설정
- **ANDROID_HOME** 환경변수 설정
- **Java Development Kit (JDK)** 설치

### 4. iOS 개발 환경 (macOS만)
- **Xcode** 설치
- **CocoaPods** 설치: `sudo gem install cocoapods`

## 🚀 프로젝트 설정

### 1. 저장소 클론 및 설치
```bash
# 저장소 클론
git clone [repository-url]
cd melog_front

# 의존성 설치
npm install

# iOS 의존성 설치 (macOS만)
cd ios && pod install && cd ..
```

### 2. 환경 변수 설정
```bash
# .env 파일 생성
touch .env

# 필요한 환경 변수 추가
API_BASE_URL=your_api_base_url
KAKAO_APP_KEY=your_kakao_app_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
CLASSICAL_MUSIC_API_KEY=your_classical_music_api_key
CONCERT_INFO_API_KEY=your_concert_info_api_key
```

### 3. 앱 실행
```bash
# Metro 서버 시작
npm start

# Android 실행
npm run android

# iOS 실행 (macOS만)
npm run ios
```

## 📱 주요 기능별 개발 가이드

### 🔐 인증 시스템

#### 카카오 로그인 설정
1. **카카오 개발자 콘솔**에서 앱 등록
2. **네이티브 앱 키** 발급
3. **Redirect URI** 설정

```typescript
// src/components/KakaoLoginButton.tsx
// 카카오 로그인 WebView 구현
```

#### 토큰 관리
```typescript
// src/utils/tokenStorage.ts
import EncryptedStorage from 'react-native-encrypted-storage';

export const setAccessToken = async (token: string) => {
  await EncryptedStorage.setItem('accessToken', token);
};

export const getAccessToken = async () => {
  return await EncryptedStorage.getItem('accessToken');
};
```

### 🎵 클래식 정보 기능

#### 연주회/콘서트 정보 연동
1. **외부 API 연동**: 클래식 음악 정보 제공 API
2. **연주회장 데이터베이스**: 콘서트홀, 오페라하우스 정보
3. **일정 관리**: 연주회 스케줄 및 알림

```typescript
// src/api/concerts.ts
export const getConcerts = async (params?: {
  date?: string;
  venue?: string;
  composer?: string;
}) => {
  const response = await axiosInstance.get('/api/concerts', { params });
  return response.data;
};

export const getConcertDetail = async (id: number) => {
  const response = await axiosInstance.get(`/api/concerts/${id}`);
  return response.data;
};
```

#### 작곡가/연주자 정보
```typescript
// src/api/artists.ts
export const getComposers = async () => {
  const response = await axiosInstance.get('/api/composers');
  return response.data;
};

export const getPerformers = async () => {
  const response = await axiosInstance.get('/api/performers');
  return response.data;
};
```

#### 위치 권한 관리
```typescript
// src/hooks/useLocationPermission.ts
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

export const useLocationPermission = () => {
  const requestLocationPermission = async () => {
    const result = await request(
      Platform.OS === 'ios' 
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
    );
    return result === RESULTS.GRANTED;
  };
  
  return { requestLocationPermission };
};
```

### 📝 게시판 기능

#### 게시글 CRUD
```typescript
// src/api/posts.ts
export const createPost = async (postData: CreatePostRequest) => {
  const response = await axiosInstance.post('/api/posts', postData);
  return response.data;
};

export const getPosts = async (params?: {
  category?: 'composer' | 'review' | 'sheet_music' | 'question';
  composer?: string;
  instrument?: string;
}) => {
  const response = await axiosInstance.get('/api/posts', { params });
  return response.data;
};

export const getPost = async (id: number) => {
  const response = await axiosInstance.get(`/api/posts/${id}`);
  return response.data;
};
```

#### React Query 훅
```typescript
// src/hooks/queries/usePostQueries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const usePostsQuery = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
  });
};

export const useCreatePostMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};
```

## 🎨 UI 컴포넌트 개발 가이드

### 공통 컴포넌트 구조
```typescript
// src/components/CustomButton.tsx
interface CustomButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  disabled = false,
  variant = 'primary'
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        disabled && styles.disabled
      ]}
      onPress={onPress}
      disabled={disabled}>
      <Text style={[styles.buttonText, styles[`${variant}Text`]]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};
```

### 스타일 가이드
```typescript
// src/constants/colors.ts
export const colors = {
  // Primary Colors
  PRIMARY_500: '#2196F3',
  PRIMARY_400: '#42A5F5',
  
  // Grayscale
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  GRAY_100: '#F5F5F5',
  GRAY_200: '#EEEEEE',
  GRAY_400: '#BDBDBD',
  GRAY_600: '#757575',
  GRAY_800: '#424242',
  
  // Semantic Colors
  SUCCESS: '#4CAF50',
  WARNING: '#FF9800',
  ERROR: '#F44336',
  INFO: '#2196F3',
} as const;
```

## 🔄 상태 관리 가이드

### Context API 사용
```typescript
// src/contexts/AuthContext.tsx
interface AuthContextType {
  isLogin: boolean;
  user: User | null;
  setIsLogin: (value: boolean) => void;
  setUser: (user: User | null) => void;
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  return (
    <AuthContext.Provider value={{ isLogin, user, setIsLogin, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};
```

## 🧭 네비게이션 가이드

### 스택 네비게이터 설정
```typescript
// src/navigations/stack/PostStackNavigator.tsx
export type PostStackParamList = {
  [postNavigations.POST_HOME]: undefined;
  [postNavigations.POST_PAGE]: { postId: number };
  [postNavigations.POST_CREATE]: undefined;
};

function PostStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={postNavigations.POST_HOME}
        component={PostHomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={postNavigations.POST_PAGE}
        component={PostPageScreen}
        options={{ title: '게시글' }}
      />
    </Stack.Navigator>
  );
}
```

### 네비게이션 사용법
```typescript
// 화면 이동
const navigation = useNavigation<NavigationProp<PostStackParamList>>();

// 파라미터와 함께 이동
navigation.navigate(postNavigations.POST_PAGE, { postId: 1 });

// 파라미터 받기
const route = useRoute<RouteProp<PostStackParamList, 'POST_PAGE'>>();
const { postId } = route.params;
```

## 🔧 빌드 & 배포 가이드

### Android 빌드
```bash
# Debug APK 생성
cd android
./gradlew assembleDebug

# Release APK 생성
./gradlew assembleRelease

# AAB 파일 생성 (Play Store 업로드용)
./gradlew bundleRelease
```

### iOS 빌드
1. Xcode에서 프로젝트 열기
2. Product > Archive 선택
3. Distribute App 버튼 클릭
4. App Store Connect 또는 Ad Hoc 선택

## 🐛 트러블슈팅

### 자주 발생하는 문제들

#### Metro 번들러 오류
```bash
# 캐시 삭제
npx react-native start --reset-cache

# node_modules 재설치
rm -rf node_modules && npm install
```

#### Android 빌드 오류
```bash
# Gradle 캐시 삭제
cd android && ./gradlew clean

# Android 폴더 권한 설정
chmod +x ./gradlew
```

#### iOS Pod 설치 오류
```bash
# CocoaPods 캐시 삭제
cd ios
pod deintegrate
pod install

# 또는 전체 재설치
rm -rf Pods Podfile.lock
pod install
```

## 📋 체크리스트

### 개발 시작 전
- [ ] Node.js 16+ 설치 확인
- [ ] Android Studio 설정 완료
- [ ] Xcode 설치 (macOS)
- [ ] 환경 변수 설정
- [ ] API 키 발급 및 설정

### 코딩 컨벤션
- [ ] TypeScript 타입 정의
- [ ] ESLint 규칙 준수
- [ ] 절대 경로 (@/) 사용
- [ ] 컴포넌트명 PascalCase
- [ ] 함수명 camelCase

### 테스트
- [ ] 단위 테스트 작성
- [ ] 통합 테스트 실행
- [ ] iOS/Android 실기기 테스트

### 배포 전
- [ ] Production 빌드 테스트
- [ ] 성능 최적화 확인
- [ ] 메모리 누수 검사
- [ ] 앱 아이콘 및 스플래시 스크린 설정

---

이 가이드를 통해 MELOG 프로젝트를 효율적으로 개발하고 유지보수할 수 있습니다. 
추가 질문이나 개선사항이 있다면 언제든 문의해 주세요! 🚀
