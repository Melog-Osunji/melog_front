import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet,Dimensions } from 'react-native';
import { colors } from '@/constants';


const DEVICE_WIDTH = Dimensions.get('window').width;

const GuideModal = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => (
  <Modal transparent animationType="fade" visible={visible}>
    <View style={styles.overlay}>
      <View style={styles.modalContainer}>
        <Text style={styles.title}>편안한 감상을 위한 운영 가이드</Text>

        <Text style={styles.paragraph}>
          <Text style={styles.boldBlue}>1. 하모니룸의 분위기를 함께 만들어요.{'\n'}</Text>
          따뜻한 말 한마디, 존중하는 리액션이 중요해요.{'\n'}모두가 편안하게 대화를 나눌 수 있게 서로 배려하도록 분위기를 만들어요.
        </Text>

        <Text style={styles.paragraph}>
          <Text style={styles.boldBlue}>2. 채팅을 직접 제어할 수 있어요.{'\n'}</Text>
          감상을 방해하거나 예의에 어긋난 메세지가 있다면, 직접 삭제 혹은 사용자 퇴장 기능을 사용할 수 있어요.
        </Text>

        <Text style={styles.paragraph}>
          <Text style={styles.boldBlue}>3. 감상이 중단되지 않도록 유의해주세요.{'\n'}</Text>
          방장이 나가면 음악과 채팅이 종료될 수 있어요.
        </Text>

        <View style={styles.buttonWrapper}>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>확인</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

export default GuideModal;

const styles = StyleSheet.create({
  overlay: {
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
    },
  title: {
    fontWeight: '600',
    fontSize: 15,
    lineHeight:22,
    marginBottom: 12,
    color:colors.GRAY_600,
  },
  paragraph: {
    marginBottom: 20,
    lineHeight: 20,
    color:colors.GRAY_500,
    fontSize:14,
  },
  boldBlue: {
    fontWeight: 'bold',
    color: colors.BLUE_600,
  },
  buttonWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: colors.BLUE_400,
    padding: 12,
    borderRadius:60,
    alignItems: 'center',
    marginTop: 8,
    height:44,
    width:142,
  },
  buttonText: {
    color: colors.WHITE,
    fontSize:15,
    lineHeight:22,
    fontWeight: '600',
  },
});
