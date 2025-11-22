import React, {useEffect, useRef, useState} from 'react';
import {
  findNodeHandle,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
  Dimensions,
} from 'react-native';
import {colors} from '@/constants';
import IconButton from '@/components/common/IconButton';
import {useOverlay} from '@/components/overlay/OverlayProvider';

type Props = {
  onPress?: () => void;
};
function PostOptionsBtn({onPress}: Props) {
  const [visible, setVisible] = useState(false);
  const overlay = useOverlay();
  const overlayIdRef = useRef<string | null>(null);
  const triggerRef = useRef<View | null>(null);

  const closeOverlay = () => {
    if (overlayIdRef.current) {
      overlay.hide(overlayIdRef.current);
      overlayIdRef.current = null;
    }
    setVisible(false);
  };

  const openAtTrigger = () => {
    // 측정하고 오버레이 등록
    const handle = findNodeHandle(triggerRef.current);

    const showMenuAt = (top: number, left: number, menuWidth = 160) => {
      if (overlayIdRef.current) return;
      overlayIdRef.current = overlay.show(
        <View style={{flex: 1}}>
          <TouchableOpacity
            style={styles.overlay}
            activeOpacity={1}
            onPress={closeOverlay}
          />
          <View style={[styles.menuContainer, {top, left, width: menuWidth}]}>
            <TouchableOpacity
              onPress={() => {
                onPress?.();
                closeOverlay();
                console.log('PostOptionsBtn] 삭제하기 버튼 클릭됨');
              }}
              activeOpacity={0.75}
              style={styles.btnInner}>
              <IconButton
                imageSource={require('@/assets/icons/common/trash.png')}
                size={24}
                onPress={() => {}}
              />
              <Text style={styles.text}>삭제하기</Text>
            </TouchableOpacity>
          </View>
        </View>,
      );
      // 오버레이가 등록된 뒤에 상태 켜기 — 깜박임 방지
      setVisible(true);
    };

    if (!handle) {
      // fallback: 화면 우측 상단 기준으로 위치 계산(원하시는 값으로 조정)
      const {width: w} = Dimensions.get('window');
      const menuWidth = 160;
      const top = 30;
      const left = Math.max(8, w - menuWidth - 5); // 오른쪽 정렬
      showMenuAt(top, left, menuWidth);
      return;
    }

    UIManager.measureInWindow(
      handle,
      (x: number, y: number, width: number, height: number) => {
        const menuWidth = 160;
        const top = y + height + 8;
        const left = Math.max(8, x + width - menuWidth);
        showMenuAt(top, left, menuWidth);
      },
    );
  };

  useEffect(() => {
    return () => {
      if (overlayIdRef.current) {
        console.log(
          '[PostOptionsBtn] unmount cleanup hide',
          overlayIdRef.current,
        );
        overlay.hide(overlayIdRef.current);
        overlayIdRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <View ref={triggerRef} collapsable={false}>
        <IconButton
          imageSource={require('@/assets/icons/post/Info.png')}
          size={24}
          onPress={openAtTrigger}
        />
      </View>
    </>
  );
}

export default PostOptionsBtn;

const styles = StyleSheet.create({
  menuContainer: {
    position: 'absolute',
    zIndex: 1001,
  },
  btnInner: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 44,
    backgroundColor: colors.GRAY_50,
    borderRadius: 8,
    shadowColor: colors.GRAY_300,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  text: {
    fontSize: 14,
    color: colors.ERROR_RED,
    marginLeft: 8,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
});
