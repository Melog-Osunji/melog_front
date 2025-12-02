# melog Frontend 구조

## 1. 실제 폴더 구조

```
src/components/         # 재사용 UI 컴포넌트
src/screens/auth/       # 인증 관련 화면
src/screens/map/        # 지도 관련 화면
src/screens/post/       # 게시판 관련 화면
src/screens/mypage/     # 마이페이지 관련 화면
src/constants/          # 상수, 타입, 네비게이션 이름 등
src/api/                # axios 인스턴스 등 API 관련
src/contexts/           # 전역 상태 관리
```

---

### 2. 요약

- 인증 → 위치 인증 → 메인(지도/게시판/마이페이지)으로 이어지는 구조
- 각 단계별로 화면(Screen)과 재사용 컴포넌트로 분리
- 네비게이션은 Stack/Tab/Drawer로 계층화
- 상태/토큰/유틸은 별도 파일로 관리

> 실제 코드와 플로우차트 모두 반영한 구조입니다.  
> 각 컴포넌트/화면의 세부 구현은 `src/components/`, `src/screens/` 폴더에서 확인할 수 있습니다.

## 3. 앱 루트 구조

- **App.tsx**
  - QueryClientProvider
    - AuthProvider
      - NavigationContainer
        - RootNavigator

## 4. 네비게이션 구조

- **RootNavigator**
  - 인증 스택: AuthStackNavigator
    - AuthHomeScreen (카카오 로그인)
      - KakaoLoginButton
    - AuthLocationScreen (위치 인증)
      - GoogleMapView 또는 KakaoMapView
  - 메인 스택: RootStackNavigator
    - 탭/드로어 네비게이션
      - 게시판
        - PostHomeScreen
        - PostPageScreen
        - PostCreateScreen
      - 마이페이지
        - MyPageScreen
        - 기타 마이페이지 관련 화면

## 5. 주요 컴포넌트 계층

### 메인/게시판/마이페이지

- **MapHomeScreen**  
  (지도 및 마커 표시)
- **MapInfoScreen**  
  (장소 상세 정보 표시)
- **PostHomeScreen**  
  (게시글 리스트)
  - PostListItem
- **PostPageScreen**  
  (게시글 상세)
  - LikeAndComment
  - PostStats
- **PostCreateScreen**  
  (게시글 작성)
- **MyPageScreen**  
  (내 정보, 내 게시글 등)

### 공통 컴포넌트

- CustomHeader
- CustomButton
- LikeAndComment
- PostStats

## 4. 상태 관리 및 유틸

- AuthContext: 인증 상태 관리
- tokenStorage: 토큰 저장/불러오기
- axiosInstance: API 통신 (토큰 자동 포함)
- useUserLocation: 위치 정보 훅

## 5. 전체 흐름 요약

- 앱 실행 → 인증 여부 확인
- 미인증 시:  
  카카오 로그인 → 위치 인증 → 메인 네비게이션 진입
- 인증 완료 시:  
  메인(지도/게시판/마이페이지) 진입
- 게시판/마이페이지 등에서 세부 기능 분기
