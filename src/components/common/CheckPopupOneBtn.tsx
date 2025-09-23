import React from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ColorValue,
    ViewStyle,
    Pressable,
    Image,
} from 'react-native';
import { colors } from '@/constants';

const DEVICE_WIDTH = Dimensions.get('window').width;

interface Props {
  visible: boolean;
  onClose: () => void;
  iconImg?: any; // 아이콘 이미지
  title?: string;
  content: string;
  btnColor: ColorValue;
  btnTextColor: ColorValue;
  btnText: string;
  btnBorderColor?: ColorValue;
}

export default function CheckPopupOneBtn({
    visible,
    onClose,
    onExit,
    iconImg,
    title,
    content,
    btnColor,
    btnTextColor,
    btnText,
    btnBorderColor,
}: Props){

    return (
        <Modal
              transparent
              animationType="fade"
              visible={visible}
              onRequestClose={onClose}
        >
            <View style={styles.backdrop}>
                <View style={styles.modalContainer}>
                    {iconImg && <Image source={iconImg} style={styles.icon} />}

                    {title && <Text style={styles.title}>{title}</Text>}
                    <Text style={styles.subtitle}>{content}</Text>

                    <View style={styles.buttonRow}>
                        <Pressable style={[styles.button,
                                           {
                                             backgroundColor: btnColor,
                                             borderWidth: btnBorderColor ? 1 : 0,
                                             borderColor: btnBorderColor
                                           }
                                         ]}
                                    onPress={onClose}>
                          <Text style={[styles.exitText, {color: btnTextColor}]}>{btnText}</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    )
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: DEVICE_WIDTH - 40,
    backgroundColor: colors.WHITE,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom : 20,
    alignItems: 'center',
    shadowColor: colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 9,
    elevation: 5,
  },
  icon: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: 0.15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 12,
    color: colors.GRAY_600,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0.2,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 28,
    color: colors.GRAY_500,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius:999,
  },
  exitText: {
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: 0.15,
    lineHeight: 22,
    textAlign: 'center',
  },
});