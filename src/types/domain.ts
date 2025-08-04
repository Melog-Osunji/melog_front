type MarkerColor = 'RED' | 'YELLOW' | 'GREEN' | 'BLUE' | 'PURPLE';

type Category = {
  [key in MarkerColor]: string;
};

interface Profile {
  id: number;
  email: string;
  nickname: string | null;
  imageUri: string | null;
  kakaoImageUri: string | null;
  loginType: 'email' | 'kakao' | 'apple';
}

interface FeedType {
  id: string;
  name: string;
  posts?: any[]; // 선택적으로 포스트 데이터를 포함할 수 있음
}

export type {MarkerColor, Category, Profile, FeedType};
