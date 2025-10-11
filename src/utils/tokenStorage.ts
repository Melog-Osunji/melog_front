import {
  setEncryptStorage,
  getEncryptStorage,
  removeEncryptStorage,
} from './encryptStorage';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_INFO_KEY = 'user_info';
const REGISTRATION_STATUS_KEY = 'registration_completed';

interface TokenData {
  accessToken: string;
  refreshToken: string;
}

interface UserInfo {
  id: string;
  email: string;
  platform: string;
  nickName: string;
  profileImg: string;
  intro: string | null;
}

// Access Token 저장
export const setAccessToken = async (token: string): Promise<void> => {
  const cleanToken = token.replace('Bearer ', '');
  await setEncryptStorage(ACCESS_TOKEN_KEY, cleanToken);
};

// Access Token 조회
export const getAccessToken = async (): Promise<string | null> => {
  return await getEncryptStorage(ACCESS_TOKEN_KEY);
};

// Refresh Token 저장
export const setRefreshToken = async (token: string): Promise<void> => {
  await setEncryptStorage(REFRESH_TOKEN_KEY, token);
};

// Refresh Token 조회
export const getRefreshToken = async (): Promise<string | null> => {
  return await getEncryptStorage(REFRESH_TOKEN_KEY);
};

// 토큰 일괄 저장
export const setTokens = async (tokenData: TokenData): Promise<void> => {
  await Promise.all([
    setAccessToken(tokenData.accessToken),
    setRefreshToken(tokenData.refreshToken),
  ]);
};

// 사용자 정보 저장
export const setUserInfo = async (userInfo: UserInfo): Promise<void> => {
  await setEncryptStorage(USER_INFO_KEY, userInfo);
};

// 사용자 정보 조회
export const getUserInfo = async (): Promise<UserInfo | null> => {
  return await getEncryptStorage(USER_INFO_KEY);
};

// 가입 상태 저장
export const setRegistrationStatus = async (
  completed: boolean,
): Promise<void> => {
  await setEncryptStorage(REGISTRATION_STATUS_KEY, completed);
};

// 가입 상태 조회
export const getRegistrationStatus = async (): Promise<boolean> => {
  const status = await getEncryptStorage(REGISTRATION_STATUS_KEY);
  return status === true;
};

// 모든 인증 데이터 삭제
export const clearAuthData = async (): Promise<void> => {
  await Promise.all([
    removeEncryptStorage(ACCESS_TOKEN_KEY),
    removeEncryptStorage(REFRESH_TOKEN_KEY),
    removeEncryptStorage(USER_INFO_KEY),
    removeEncryptStorage(REGISTRATION_STATUS_KEY),
  ]);
};

// 로그인 상태 확인
export const isLoggedIn = async (): Promise<boolean> => {
  const accessToken = await getAccessToken();
  const refreshToken = await getRefreshToken();
  return !!(accessToken && refreshToken);
};
