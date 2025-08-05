import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { colors } from '@/constants';

const DEVICE_WIDTH = Dimensions.get('window').width;

interface Props {
  visible: boolean;
  onClose: () => void;
  onExit: () => void;
}

export default function ExitConfirmModal({ visible, onClose, onExit }: Props) {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>아직 감상이 끝나지 않았어요</Text>
          <Text style={styles.subtitle}>나가면 음악과 대화가 종료됩니다.</Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.exitButton} onPress={onExit}>
              <Text style={styles.exitText}>나가기</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.stayButton} onPress={onClose}>
              <Text style={styles.stayText}>머무르기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: DEVICE_WIDTH - 40,
    backgroundColor: colors.WHITE,
    borderRadius: 8,
    paddingTop:24,
    paddingBottom:20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight:22,
    color: colors.GRAY_600,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight:20,
    color: colors.GRAY_400,
    marginBottom: 28,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  exitButton: {
    flex: 1,
    backgroundColor: colors.GRAY_100,
    paddingVertical: 12,
    borderRadius: 60,
    alignItems: 'center',
  },
  stayButton: {
    flex: 1,
    backgroundColor: colors.BLUE_400,
    paddingVertical: 12,
    borderRadius: 60,
    alignItems: 'center',
  },
  exitText: {
    color: colors.GRAY_300,
    fontWeight: '600',
    fontSize: 15,
    lineHeight:22,
  },
  stayText: {
    color: colors.WHITE,
    fontWeight: '600',
    fontSize: 15,
    lineHeight:22,
  },
});
