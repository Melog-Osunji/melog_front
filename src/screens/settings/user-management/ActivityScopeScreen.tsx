import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors} from '@/constants';
import SettingHeader from '@/components/settings/SettingHeader';
import SwitchToggle from '@/components/common/SwitchToggle';
import {useAuthContext} from '@/contexts/AuthContext';
import {showToast} from '@/components/common/ToastService';

export default function ActivityScopeScreen() {
  const {isPrivate, updatePrivateStatus} = useAuthContext();
  const [localValue, setLocalValue] = useState(isPrivate);
  const [isLoading, setIsLoading] = useState(false);

  // 전역 상태와 동기화
  useEffect(() => {
    setLocalValue(isPrivate);
  }, [isPrivate]);

  const handleToggle = async (newValue: boolean) => {
    setIsLoading(true);
    setLocalValue(newValue);
    try {
      // 전역 상태 업데이트
      await updatePrivateStatus(newValue);
      showToast('공개 설정 변경 완료', 'success');
    } catch (error) {
      console.error('공개 설정 변경 실패:', error);
      showToast('공개 설정 변경에 실패했습니다. 다시 시도해주세요.', 'error');
      // 롤백
      setLocalValue(isPrivate);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <SettingHeader title="나의 활동 범위" />
      <View style={styles.body}>
        <Text style={styles.h2}>내 계정</Text>
        <View style={styles.container}>
          <View style={styles.btn_container}>
            <Text style={styles.h1}>비공개 설정</Text>
            <SwitchToggle
              value={localValue}
              onValueChange={handleToggle}
              size="md"
              isloading={isLoading}
            />
          </View>
          <Text style={styles.h3}>
            내 팔로워 혹은 내가 승인한 사용자만 내 피드를 볼 수 있습니다.
            {'\n\n'}프로필 사진, 사용자 이름 등의 전반적인 정보는 ‘Melog’의 모든
            사용자가 확인할 수 있습니다.{'\n\n'}팔로워는 내 게시물을 공유할 수
            없습니다.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.WHITE},
  body: {flex: 1, paddingVertical: 10, paddingHorizontal: 20},
  container: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 10,
  },
  btn_container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  h1: {
    color: colors.BLACK,
    fontFamily: 'Noto Sans KR',
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 20,
    letterSpacing: 0.2,
  },
  h2: {
    color: colors.BLACK,
    fontFamily: 'Noto Sans KR',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.2,
  },
  h3: {
    color: colors.GRAY_400,
    fontFamily: 'Noto Sans KR',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.2,
  },
});
