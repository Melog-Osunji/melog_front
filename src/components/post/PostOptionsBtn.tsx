import React, {useEffect, useRef, useState} from 'react';
import {
  findNodeHandle,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
  Dimensions,
  ImageSourcePropType,
} from 'react-native';
import {colors} from '@/constants';
import IconButton from '@/components/common/IconButton';
import {useOverlay} from '@/components/overlay/OverlayProvider';

type Props = {
  onPress?: () => void;
  btnIcon?: ImageSourcePropType; // 버튼 아이콘을 props로 받음
  btnText?: string; // 버튼 텍스트를 props로 받음
};

function PostOptionsBtn({
  onPress,
  btnIcon = require('@/assets/icons/common/trash.png'),
  btnText = '삭제하기',
}: Props) {
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
              }}
              activeOpacity={0.75}
              style={styles.btnInner}>
              <IconButton imageSource={btnIcon} size={24} />
              <Text style={styles.text}>{btnText}</Text>
            </TouchableOpacity>
          </View>
        </View>,
      );
      setVisible(true);
    };

    if (!handle) {
      const {width: w} = Dimensions.get('window');
      const menuWidth = 160;
      const top = 30;
      const left = Math.max(8, w - menuWidth - 5);
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
