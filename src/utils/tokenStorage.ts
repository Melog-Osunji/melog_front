import EncryptedStorage from 'react-native-encrypted-storage';

export async function saveAccessToken(token: string) {
  await EncryptedStorage.setItem('accessToken', token);
}

export async function getAccessToken(): Promise<string | null> {
  return await EncryptedStorage.getItem('accessToken');
}

export async function removeAccessToken() {
  await EncryptedStorage.removeItem('accessToken');
}
