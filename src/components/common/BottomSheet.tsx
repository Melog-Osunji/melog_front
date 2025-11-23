import React, {useRef, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Modal,
  Pressable,
  Animated,
  Dimensions,
  PanResponder,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
} from 'react-native';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  height?: number | string;
  enableSwipeDown?: boolean;
  handleTriggerHeight?: number; // 상단 드래그 캡처 가능 영역 (단위 : 픽셀)
}

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

export default function BottomSheet({
  visible,
  onClose,
  children,
  height = '50%',
  enableSwipeDown = true,
  handleTriggerHeight = 10,
}: BottomSheetProps) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const keyboardVisibleRef = useRef(false);

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 20,
      }).start();
    } else {
      Animated.spring(translateY, {
        toValue: SCREEN_HEIGHT,
        useNativeDriver: true,
        tension: 50,
        friction: 20,
      }).start();
    }
  }, [visible, translateY]);

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onKeyboardShow = (e: any) => {
      const kH = e.endCoordinates?.height ?? 0;
      keyboardVisibleRef.current = true;
      Animated.spring(translateY, {
        toValue: kH,
        useNativeDriver: true,
        tension: 50,
        friction: 20,
      }).start();
    };

    const onKeyboardHide = () => {
      keyboardVisibleRef.current = false;
      Animated.spring(translateY, {
        toValue: visible ? 0 : SCREEN_HEIGHT,
        useNativeDriver: true,
        tension: 50,
        friction: 20,
      }).start();
    };

    const showSub = Keyboard.addListener(showEvent, onKeyboardShow);
    const hideSub = Keyboard.addListener(hideEvent, onKeyboardHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [translateY, visible]);

  const panResponder = useRef(
    PanResponder.create({
      // 터치 캡처
      // - 시작 위치가 상단(handle 영역)이면 즉시 캡처하여 드래그 허용
      // - 그렇지 않으면 움직임이 세로로 충분히 크면 capture 해서 드래그로 전환
      onStartShouldSetPanResponderCapture: evt => {
        if (!enableSwipeDown) return false;
        const {locationY} = evt.nativeEvent;
        // 상단 handleTriggerHeight(px) 영역을 드래그 핸들 영역으로 간주
        return locationY <= handleTriggerHeight;
      },
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        if (!enableSwipeDown) return false;
        const {dx, dy} = gestureState;
        const isVertical = Math.abs(dy) > Math.abs(dx);
        const enoughMove = Math.abs(dy) > 6;
        return isVertical && enoughMove && dy > 0;
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        if (!enableSwipeDown) return false;
        const {dx, dy} = gestureState;
        return dy > 0 && Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 6;
      },
      onPanResponderGrant: () => {
        // 현재 애니메이션 위치를 오프셋으로 설정 -> 드래그 시작 기준으로 만듦
        translateY.stopAnimation((currentValue: number) => {
          translateY.setOffset(currentValue);
          translateY.setValue(0);
        });
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        translateY.flattenOffset();
        // 속도 또는 이동거리 기준으로 닫기 판단
        if (gestureState.vy > 0.5 || gestureState.dy > 100) {
          onClose();
        } else {
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
        const percentage = parseInt(height.replace('%', ''), 10);
        return (SCREEN_HEIGHT * percentage) / 100;
      }
      return parseInt(height, 10);
    }
    return height;
  };

  return (
    <Modal
      animationType="none"
      transparent
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        {/* overlay 영역만 눌렀을 때 동작하도록 별도 Pressable(absolute) 사용.
            sheet 내부(Animated.View)로의 터치는 onClose를 트리거하지 않음 */}
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => {
            if (keyboardVisibleRef.current) {
              Keyboard.dismiss();
              return;
            }
            onClose();
          }}
        />

        <Animated.View
          style={[
            styles.bottomSheet,
            {
              height: getHeightValue(),
              transform: [{translateY}],
            },
          ]}
          {...(enableSwipeDown ? panResponder.panHandlers : {})}>
          <View style={styles.handleBar} />

          {/* panHandlers를 KeyboardAvoidingView에도 붙여서 내부 스크롤/터치가 먼저 잡아도
              드래그로 전환할 수 있도록 보조 */}
          <KeyboardAvoidingView
            {...(enableSwipeDown ? panResponder.panHandlers : {})}
            style={styles.content}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
            {children}
          </KeyboardAvoidingView>
        </Animated.View>
      </View>
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
