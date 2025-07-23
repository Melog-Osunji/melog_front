# MELOG Frontend 개발 가이드

## 📱 프로젝트 개요

**MELOG**는 클래식 음악을 사랑하는 사람들을 위한 커뮤니티 앱입니다.
- 클래식 음악 관련 정보 공유 및 토론
- 연주회/콘서트 정보 및 후기 공유
- 클래식 음악 애호가들 간의 소통과 교류
- 음악가, 작품, 연주 정보 데이터베이스

## 🚀 빠른 시작

### 필수 요구사항
- Node.js >= 16
- React Native CLI
- Android Studio (Android 개발)
- Xcode (iOS 개발)

### 설치 및 실행

```bash
# 의존성 설치
npm install

# Metro 서버 시작
npm start

# Android 실행
npm run android

# iOS 실행 (macOS만)
npm run ios
```

### 주요 스크립트
```bash
npm run lint          # ESLint 실행
npm test              # Jest 테스트 실행
npm run clean-install # 캐시 클리어 후 재설치
```

## 📁 프로젝트 구조

```
src/
├── api/                    # API 관련
│   ├── axios.ts           # Axios 인스턴스
│   ├── axiosInstance.ts   # 인증 포함 인스턴스
│   └── queryClient.ts     # React Query 클라이언트
├── assets/                # 이미지, 폰트, 아이콘
├── components/            # 재사용 가능한 컴포넌트
│   ├── CustomButton.tsx
│   ├── CustomHeader.tsx
│   ├── GoogleMapView.tsx
│   ├── KakaoLoginButton.tsx
│   ├── LikeAndComment.tsx
│   └── PostListItem.tsx
├── constants/             # 상수 및 타입 정의
│   ├── colors.ts         # 색상 팔레트
│   ├── navigations.ts    # 네비게이션 상수
│   ├── types.ts          # TypeScript 타입 정의
│   └── index.ts          # 통합 export
├── contexts/              # React Context
│   └── AuthContext.tsx   # 인증 상태 관리
├── hooks/                 # 커스텀 훅
│   ├── useUserLocation.ts
│   ├── useLocationPermission.ts
│   └── queries/          # React Query 훅들
├── navigations/           # 네비게이션 구조
│   ├── root/             # 루트 네비게이터
│   ├── stack/            # 스택 네비게이터들
│   ├── tab/              # 탭 네비게이터
│   └── drawer/           # 드로어 네비게이터 (미사용)
├── screens/               # 화면 컴포넌트들
│   ├── auth/             # 인증 관련 화면
│   ├── map/              # 연주회장/콘서트홀 정보 화면
│   ├── post/             # 게시판 관련 화면
│   └── mypage/           # 마이페이지
├── types/                 # 타입 정의
├── utils/                 # 유틸리티 함수들
└── config.ts             # 앱 설정
```

## 🔗 네비게이션 구조

```
App.tsx
└── RootNavigator
    ├── AuthStackNavigator (로그인하지 않은 경우)
    │   ├── AuthHomeScreen (카카오 로그인)
    │   └── AuthLocationScreen (위치 인증)
    └── MainTabNavigator (로그인한 경우)
        ├── 홈 탭 → MapStackNavigator
        │   ├── MapHomeScreen (클래식 정보 홈)
        │   └── MapInfoScreen (연주회장/음악회 정보)
        ├── 게시판 탭 → PostStackNavigator
        │   ├── PostHomeScreen (게시글 목록)
        │   ├── PostPageScreen (게시글 상세)
        │   └── PostCreateScreen (게시글 작성)
        └── MY 탭 → MyPageScreen
```

## 🛠 주요 기능 구현

### 1. 인증 시스템
- **카카오 로그인**: `KakaoLoginButton` 컴포넌트 사용
- **사용자 프로필**: 클래식 음악 취향 및 관심사 설정
- **토큰 관리**: `encryptStorage`를 통한 안전한 저장

### 2. 클래식 정보 기능
- **연주회 정보**: 클래식 콘서트 및 연주회 일정
- **연주회장 정보**: 콘서트홀, 오페라하우스 등 위치 및 상세 정보
- **작곡가/연주자 정보**: 클래식 음악가 데이터베이스

### 3. 게시판 기능
- **게시글 CRUD**: 생성, 조회, 수정, 삭제
- **카테고리**: 작곡가 토론, 연주 후기, 악보 공유, 질문/답변
- **좋아요/댓글**: 클래식 애호가들 간의 상호작용

## 🎨 디자인 시스템

### 색상 팔레트 (`src/constants/colors.ts`)
```typescript
export const colors = {
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  GRAY_200: '#F5F5F5',
  GRAY_400: '#BDBDBD',
  BLUE_400: '#2196F3',
  GREEN: '#4CAF50',
  // ... 기타 색상들
};
```

### 공통 컴포넌트
- **CustomButton**: 재사용 가능한 버튼
- **CustomHeader**: 공통 헤더
- **PostListItem**: 게시글 목록 아이템
- **LikeAndComment**: 좋아요/댓글 UI

## 📱 상태 관리

### Context API
- **AuthContext**: 로그인 상태 및 사용자 정보 관리

### React Query
- **API 호출**: `@tanstack/react-query` 사용
- **캐싱**: 자동 데이터 캐싱 및 동기화
- **에러 처리**: 일관된 에러 처리

## 🔧 개발 환경 설정

### TypeScript 설정
- 절대 경로 import: `@/` 별칭 사용
- 엄격한 타입 체크 활성화

### ESLint & Prettier
- React Native 스타일 가이드 적용
- 자동 포맷팅 설정

### Metro 설정
- 폰트 에셋 자동 연결
- 절대 경로 해결

## 📡 API 통신

### Axios 설정
```typescript
// src/api/axiosInstance.ts
const axiosInstance = axios.create({
  baseURL: 'YOUR_API_BASE_URL',
  timeout: 10000,
});

// 토큰 자동 첨부 인터셉터
axiosInstance.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 주요 API 엔드포인트
- **인증**: `/api/auth/login`, `/api/auth/refresh`
- **연주회장**: `/api/venues`, `/api/venues/:id`
- **연주회 정보**: `/api/concerts`, `/api/concerts/:id`
- **게시글**: `/api/posts`, `/api/posts/:id`
- **작곡가/연주자**: `/api/artists`, `/api/composers`

## 🔐 보안 고려사항

### 토큰 저장
```typescript
// 암호화된 스토리지 사용
import EncryptedStorage from 'react-native-encrypted-storage';

export const setAccessToken = async (token: string) => {
  await EncryptedStorage.setItem('accessToken', token);
};
```

### 권한 관리
- 위치 권한: `react-native-permissions` (연주회장 찾기용)
- 알림 권한: 연주회 일정 알림
- 오디오 권한: 음악 재생 기능 (향후 확장)

## 🧪 테스트

### Jest 설정
```bash
# 테스트 실행
npm test

# 커버리지 확인
npm test -- --coverage
```

### 테스트 파일 위치
- `__tests__/` 폴더
- 컴포넌트별 `.test.tsx` 파일

## 📦 주요 의존성

### 네비게이션
- `@react-navigation/native`
- `@react-navigation/stack`
- `@react-navigation/bottom-tabs`

### 지도
- `react-native-maps` (Google Maps)
- `@react-native-community/geolocation`

### 상태 관리
- `@tanstack/react-query`
- React Context API

### UI/UX
- `react-native-linear-gradient`
- `react-native-safe-area-context`

## 🚀 배포

### Android 빌드
```bash
cd android
./gradlew assembleRelease
```

### iOS 빌드
1. Xcode에서 프로젝트 열기
2. Archive 생성
3. App Store Connect 업로드

## 🐛 문제 해결

### 자주 발생하는 이슈

1. **Metro 캐시 문제**
   ```bash
   npx react-native start --reset-cache
   ```

2. **Android 빌드 실패**
   ```bash
   cd android && ./gradlew clean
   ```

3. **iOS Pod 문제**
   ```bash
   cd ios && pod install
   ```

## 📝 개발 시 주의사항

1. **절대 경로 사용**: `@/` 별칭으로 import
2. **타입 안전성**: TypeScript 타입 정의 필수
3. **컴포넌트 재사용**: 공통 컴포넌트 적극 활용
4. **상태 관리**: Context vs React Query 적절히 사용
5. **성능 최적화**: useMemo, useCallback 적절히 사용

## 🤝 기여 가이드

1. Feature 브랜치 생성
2. 코드 작성 및 테스트
3. ESLint/Prettier 통과 확인
4. Pull Request 생성

## 📞 연락처

- 프로젝트 관리자: [연락처]
- 기술 문의: [연락처]

---

**Happy Coding! 🎉**