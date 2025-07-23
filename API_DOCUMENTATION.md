# MELOG API 문서 - 클래식 음악 커뮤니티

## 🎼 API 기본 정보

**MELOG**는 클래식 음악을 사랑하는 사람들을 위한 커뮤니티 플랫폼의 API입니다.

## 🌐 API 기본 정보

### Base URL
```
https://your-api-domain.com/api
```

### 인증 방식
- **Bearer Token**: JWT 토큰을 Authorization 헤더에 포함
- **Refresh Token**: 액세스 토큰 만료 시 자동 갱신

## 🔐 인증 (Authentication)

### 카카오 로그인
```http
POST /auth/kakao
Content-Type: application/json

{
  "code": "kakao_auth_code",
  "redirect_uri": "your_redirect_uri"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "nickname": "사용자닉네임",
      "profileImage": "https://profile-image-url.com",
      "email": "user@example.com"
    }
  }
}
```

### 토큰 갱신
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 사용자 프로필 설정
```http
PUT /auth/profile
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "favoriteComposers": ["Bach", "Mozart", "Beethoven"],
  "favoriteInstruments": ["Piano", "Violin"],
  "musicLevel": "intermediate", // beginner, intermediate, expert
  "interests": ["chamber_music", "opera", "symphony"]
}
```

## 🎵 연주회/콘서트 (Concerts)

### 연주회 목록 조회
```http
GET /concerts?date=2024-01-15&venue=seoul_arts_center&composer=Mozart
Authorization: Bearer {accessToken}
```

**Query Parameters:**
- `date`: 날짜 (YYYY-MM-DD)
- `venue`: 연주회장 (선택사항)
- `composer`: 작곡가 (선택사항)
- `genre`: 장르 (symphony, chamber, opera, solo 등)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "모차르트 피아노 소나타 전곡 연주회",
      "composer": "Wolfgang Amadeus Mozart",
      "performer": "김영욱",
      "venue": {
        "id": 1,
        "name": "예술의전당 콘서트홀",
        "address": "서울특별시 서초구 남부순환로 2406",
        "latitude": 37.4781,
        "longitude": 127.0117
      },
      "date": "2024-01-15T19:30:00Z",
      "price": {
        "min": 50000,
        "max": 150000
      },
      "genre": "solo",
      "instruments": ["Piano"],
      "description": "모차르트 피아노 소나타 전곡을 연주하는 특별한 무대",
      "ticketLink": "https://ticket.yes24.com/..."
    }
  ]
}
```

### 연주회 상세 조회
```http
GET /concerts/{concertId}
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "모차르트 피아노 소나타 전곡 연주회",
    "composer": "Wolfgang Amadeus Mozart",
    "performer": "김영욱",
    "venue": {
      "id": 1,
      "name": "예술의전당 콘서트홀",
      "address": "서울특별시 서초구 남부순환로 2406",
      "latitude": 37.4781,
      "longitude": 127.0117,
      "capacity": 2600,
      "acoustics": "excellent",
      "facilities": ["parking", "restaurant", "shop"]
    },
    "program": [
      {
        "order": 1,
        "work": "Piano Sonata No. 11 in A major, K. 331",
        "movements": ["Andante grazioso", "Menuetto", "Alla Turca"]
      }
    ],
    "date": "2024-01-15T19:30:00Z",
    "duration": 120,
    "price": {
      "vip": 150000,
      "r": 100000,
      "s": 70000,
      "a": 50000
    },
    "reviews": [
      {
        "userId": 1,
        "userName": "클래식러버",
        "rating": 5,
        "comment": "정말 환상적인 연주였습니다!"
      }
    ]
  }
}
```

## 📝 게시글 (Posts)

### 게시글 목록 조회
```http
GET /posts?page=1&limit=10&category=composer&composer=Mozart
Authorization: Bearer {accessToken}
```

**Query Parameters:**
- `page`: 페이지 번호 (기본값: 1)
- `limit`: 페이지당 항목 수 (기본값: 10)
- `category`: 카테고리 ('composer', 'review', 'sheet_music', 'question')
- `composer`: 작곡가 이름 (선택사항)
- `instrument`: 악기 (선택사항)

**Response:**
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": 1,
        "title": "모차르트 피아노 소나타 K.331 연주 팁",
        "content": "터키 행진곡으로 유명한 이 곡을...",
        "category": "sheet_music",
        "composer": "Mozart",
        "instrument": "Piano",
        "authorId": 1,
        "authorName": "피아니스트123",
        "likeCount": 25,
        "commentCount": 8,
        "viewCount": 340,
        "tags": ["모차르트", "피아노", "소나타", "연주법"],
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### 게시글 상세 조회
```http
GET /posts/{postId}
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "모차르트 피아노 소나타 K.331 연주 팁",
    "content": "터키 행진곡으로 유명한 이 곡을 연주할 때 주의할 점들을 정리해보았습니다...",
    "category": "sheet_music",
    "composer": "Mozart",
    "instrument": "Piano",
    "authorId": 1,
    "authorName": "피아니스트123",
    "authorProfileImage": "https://profile.jpg",
    "likeCount": 25,
    "commentCount": 8,
    "viewCount": 341,
    "isLiked": false,
    "tags": ["모차르트", "피아노", "소나타", "연주법"],
    "attachments": [
      {
        "type": "sheet_music",
        "url": "https://sheet-music.pdf",
        "title": "K.331 1악장 악보"
      }
    ],
    "relatedWorks": [
      {
        "composer": "Mozart",
        "title": "Piano Sonata No. 11 in A major, K. 331",
        "movements": ["Andante grazioso", "Menuetto", "Alla Turca"]
      }
    ],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### 게시글 작성
```http
POST /posts
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "title": "베토벤 교향곡 9번 감상 후기",
  "content": "어제 예술의전당에서 열린 베토벤 9번 공연을 다녀왔습니다...",
  "category": "review",
  "composer": "Beethoven",
  "tags": ["베토벤", "교향곡", "9번", "환상"]
}
```

### 게시글 수정
```http
PUT /posts/{postId}
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "title": "수정된 제목",
  "content": "수정된 내용",
  "categoryId": 2
}
```

### 게시글 삭제
```http
DELETE /posts/{postId}
Authorization: Bearer {accessToken}
```

## 👍 좋아요 (Likes)

### 좋아요 토글
```http
POST /posts/{postId}/like
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "isLiked": true,
    "likeCount": 16
  }
}
```

## 💬 댓글 (Comments)

### 댓글 목록 조회
```http
GET /posts/{postId}/comments
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "content": "좋은 정보 감사합니다!",
      "authorId": 2,
      "authorName": "사용자2",
      "authorProfileImage": "https://profile2.jpg",
      "createdAt": "2024-01-15T11:00:00Z"
    }
  ]
}
```

### 댓글 작성
```http
POST /posts/{postId}/comments
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "content": "댓글 내용입니다."
}
```

### 댓글 삭제
```http
DELETE /comments/{commentId}
Authorization: Bearer {accessToken}
```

## 🎼 작곡가/연주자 (Artists)

### 작곡가 목록 조회
```http
GET /composers?period=classical&nationality=German
Authorization: Bearer {accessToken}
```

**Query Parameters:**
- `period`: 시대 (baroque, classical, romantic, modern)
- `nationality`: 국적
- `instrument`: 주요 악기

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Wolfgang Amadeus Mozart",
      "period": "Classical",
      "nationality": "Austrian",
      "birthYear": 1756,
      "deathYear": 1791,
      "biography": "오스트리아의 작곡가...",
      "majorWorks": [
        "Symphony No. 40 in G minor",
        "Piano Sonata No. 11 in A major",
        "Requiem in D minor"
      ],
      "profileImage": "https://composer-image.jpg"
    }
  ]
}
```

### 작곡가 상세 조회
```http
GET /composers/{composerId}
Authorization: Bearer {accessToken}
```

### 연주자 목록 조회
```http
GET /performers?instrument=Piano&country=Korea
Authorization: Bearer {accessToken}
```

## 🏛 연주회장 (Venues)

### 연주회장 목록 조회
```http
GET /venues?city=Seoul&type=concert_hall
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "예술의전당 콘서트홀",
      "type": "concert_hall",
      "address": "서울특별시 서초구 남부순환로 2406",
      "latitude": 37.4781,
      "longitude": 127.0117,
      "capacity": 2600,
      "acoustics": "excellent",
      "website": "https://sac.or.kr",
      "facilities": ["parking", "restaurant", "shop"],
      "images": ["https://venue-image1.jpg"]
    }
  ]
}
```

## 👤 사용자 (Users)

### 내 정보 조회
```http
GET /users/me
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "nickname": "클래식러버",
    "email": "user@example.com",
    "profileImage": "https://profile-image.jpg",
    "favoriteComposers": ["Bach", "Mozart", "Beethoven"],
    "favoriteInstruments": ["Piano", "Violin"],
    "musicLevel": "intermediate",
    "interests": ["chamber_music", "opera", "symphony"],
    "joinedAt": "2024-01-01T00:00:00Z",
    "stats": {
      "postsCount": 15,
      "concertsAttended": 23,
      "likesReceived": 156
    }
  }
}
```

### 내 게시글 조회
```http
GET /users/me/posts?page=1&limit=10
Authorization: Bearer {accessToken}
```

## 🏷 카테고리 (Categories)

### 카테고리 목록 조회
```http
GET /categories
```

**Response:**
```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "composer", "displayName": "작곡가 토론" },
    { "id": 2, "name": "review", "displayName": "연주 후기" },
    { "id": 3, "name": "sheet_music", "displayName": "악보 공유" },
    { "id": 4, "name": "question", "displayName": "질문/답변" },
    { "id": 5, "name": "concert_info", "displayName": "연주회 정보" }
  ]
}
```

## 🎵 악기 (Instruments)

### 악기 목록 조회
```http
GET /instruments
```

**Response:**
```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "Piano", "category": "keyboard" },
    { "id": 2, "name": "Violin", "category": "strings" },
    { "id": 3, "name": "Cello", "category": "strings" },
    { "id": 4, "name": "Flute", "category": "woodwinds" },
    { "id": 5, "name": "Trumpet", "category": "brass" }
  ]
}
```

## 🏷 태그 (Tags)

### 태그 목록 조회
```http
GET /tags?type=composer
```

**Response:**
```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "바흐", "type": "composer" },
    { "id": 2, "name": "모차르트", "type": "composer" },
    { "id": 3, "name": "베토벤", "type": "composer" },
    { "id": 4, "name": "쇼팽", "type": "composer" },
    { "id": 5, "name": "피아노", "type": "instrument" },
    { "id": 6, "name": "교향곡", "type": "genre" }
  ]
}
```

## ❌ 에러 응답

### 일반적인 에러 형식
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "에러 메시지",
    "details": {}
  }
}
```

### 주요 에러 코드

| 코드 | 설명 | HTTP 상태 |
|------|------|-----------|
| `UNAUTHORIZED` | 인증되지 않은 요청 | 401 |
| `FORBIDDEN` | 권한 없음 | 403 |
| `NOT_FOUND` | 리소스를 찾을 수 없음 | 404 |
| `VALIDATION_ERROR` | 입력값 검증 실패 | 400 |
| `LOCATION_NOT_VERIFIED` | 위치 인증 필요 | 403 |
| `TOKEN_EXPIRED` | 토큰 만료 | 401 |
| `RATE_LIMIT_EXCEEDED` | 요청 한도 초과 | 429 |

## 📱 클라이언트 구현 예시

### Axios 인스턴스 설정
```typescript
// src/api/axiosInstance.ts
import axios from 'axios';
import { getAccessToken, getRefreshToken, setAccessToken } from '@/utils/tokenStorage';

const axiosInstance = axios.create({
  baseURL: 'https://your-api-domain.com/api',
  timeout: 10000,
});

// 요청 인터셉터: 토큰 첨부
axiosInstance.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터: 토큰 갱신
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = await getRefreshToken();
      if (refreshToken) {
        try {
          const response = await axios.post('/auth/refresh', {
            refreshToken
          });
          const newToken = response.data.data.accessToken;
          await setAccessToken(newToken);
          
          // 원래 요청 재시도
          error.config.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance.request(error.config);
        } catch (refreshError) {
          // 로그아웃 처리
          await logout();
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
```

### API 함수 예시
```typescript
// src/api/posts.ts
import axiosInstance from './axiosInstance';

export interface CreatePostRequest {
  title: string;
  content: string;
  categoryId: number;
}

export const getPosts = async (params?: {
  page?: number;
  limit?: number;
  categoryId?: number;
}) => {
  const response = await axiosInstance.get('/posts', { params });
  return response.data;
};

export const getPost = async (id: number) => {
  const response = await axiosInstance.get(`/posts/${id}`);
  return response.data;
};

export const createPost = async (data: CreatePostRequest) => {
  const response = await axiosInstance.post('/posts', data);
  return response.data;
};

export const deletePost = async (id: number) => {
  const response = await axiosInstance.delete(`/posts/${id}`);
  return response.data;
};
```

---

이 API 문서를 참고하여 클라이언트와 서버 간의 통신을 구현하세요.
API 변경사항이 있을 때마다 이 문서를 업데이트해 주세요! 📝
