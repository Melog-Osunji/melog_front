import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Alert} from 'react-native';

interface PhotoSelectContentProps {
  onClose: () => void;
}

export default function PhotoSelectContent({onClose}: PhotoSelectContentProps) {
  const handleCameraPress = () => {
    onClose();
    // TODO: 카메라로 사진 촬영 기능 구현
    Alert.alert('카메라', '카메라 기능을 구현해주세요');
  };

  const handleGalleryPress = () => {
    onClose();
    // TODO: 갤러리에서 사진 선택 기능 구현
    Alert.alert('갤러리', '갤러리 기능을 구현해주세요');
  };

  const handleFilePress = () => {
    onClose();
    // TODO: 파일 선택 기능 구현
    Alert.alert('파일', '파일 선택 기능을 구현해주세요');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>사진/파일 추가</Text>
      </View>

      <TouchableOpacity style={styles.optionButton} onPress={handleCameraPress}>
        <Text style={styles.optionText}>카메라로 촬영</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.optionButton}
        onPress={handleGalleryPress}>
        <Text style={styles.optionText}>갤러리에서 선택</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionButton} onPress={handleFilePress}>
        <Text style={styles.optionText}>파일에서 선택</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
        <Text style={styles.cancelText}>취소</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  optionButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  optionText: {
    fontSize: 16,
    color: '#333333',
  },
  cancelButton: {
    marginTop: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '500',
  },
});
