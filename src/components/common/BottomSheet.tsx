import React, {useRef, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Modal,
  Pressable,
  Animated,
  Dimensions,
  PanResponder,
} from 'react-native';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  height?: number | string;
  enableSwipeDown?: boolean;
}

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

export default function BottomSheet({
  visible,
  onClose,
  children,
  height = '50%',
  enableSwipeDown = true,
}: BottomSheetProps) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      // 애니메이션으로 올라오기
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 20,
      }).start();
    } else {
      // 애니메이션으로 내려가기
      Animated.spring(translateY, {
        toValue: SCREEN_HEIGHT,
        useNativeDriver: true,
        tension: 50,
        friction: 20,
      }).start();
    }
  }, [visible, translateY]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return (
          enableSwipeDown &&
          gestureState.dy > 0 &&
          Math.abs(gestureState.dy) > Math.abs(gestureState.dx)
        );
      },
      onPanResponderGrant: () => {
        translateY.setOffset(0);
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        translateY.flattenOffset();

        // 빠르게 아래로 스와이프했거나, 100px 이상 내려갔을 때 닫기
        if (gestureState.vy > 0.5 || gestureState.dy > 100) {
          onClose();
        } else {
          // 원래 위치로 돌아가기
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            tension: 100,
            friction: 8,
          }).start();
        }
      },
    }),
  ).current;

  const getHeightValue = () => {
    if (typeof height === 'string') {
      if (height.includes('%')) {
        const percentage = parseInt(height.replace('%', ''));
        return (SCREEN_HEIGHT * percentage) / 100;
      }
      return parseInt(height);
    }
    return height;
  };

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View
          style={[
            styles.bottomSheet,
            {
              height: getHeightValue(),
              transform: [{translateY}],
            },
          ]}
          {...(enableSwipeDown ? panResponder.panHandlers : {})}>
          {/* 상단 핸들 바 */}
          <View style={styles.handleBar} />

          {/* 내용 */}
          <View style={styles.content}>{children}</View>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  content: {
    flex: 1,
  },
});
