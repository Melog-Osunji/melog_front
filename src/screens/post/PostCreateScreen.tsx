import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';

import {colors} from '@/constants';
import axiosInstance from '@/api/axiosInstance';
import {useNavigation} from '@react-navigation/native';
import {postNavigations} from '@/constants';
import {useHideTabBarOnFocus} from '@/utils/roadBottomNavigationBar';

type Tag = '공부' | '자유' | '모집' | '정보';
const tagToCategoryId: Record<Tag, number> = {
  공부: 1,
  자유: 2,
  모집: 3,
  정보: 4,
};

export default function PostForm() {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [categoryId, setCategoryId] = useState<number>(); // 카테고리 선택 UI에 맞게 관리

  useHideTabBarOnFocus();

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('알림', '제목을 입력해주세요.');
      return;
    }
    if (!content.trim()) {
      Alert.alert('알림', '본문을 입력해주세요.');
      return;
    }
    if (!categoryId) {
      Alert.alert('알림', '카테고리를 선택해주세요.');
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post('/api/posts', {
        categoryId,
        title,
        content,
        imageUrls: [], // 이미지 업로드 기능이 있다면 배열로 전달
      });

      // 응답 결과 콘솔 출력
      console.log('서버 응답:', response.data);

      if (response.data.success) {
        console.log('게시글이 등록되었습니다.');
        navigation.navigate(postNavigations.POST_HOME as never); // 여기서는 그냥 사용
      } else {
        console.log(
          'response.data.error?.message: ',
          response.data?.error?.message || 'No error message provided',
        );
      }
    } catch (error) {
      console.error('게시글 등록 에러:', error);
      Alert.alert('오류', '서버 전송에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.writeContainer}>
        <Text style={styles.label}>게시글 카테고리를 선택해주세요.</Text>
        <View style={styles.tagContainer}>
          {(['공부', '자유', '모집', '정보'] as Tag[]).map(t => (
            <TouchableOpacity
              key={t}
              style={[
                styles.tagButton,
                categoryId === tagToCategoryId[t] && styles.tagButtonSelected,
              ]}
              onPress={() => setCategoryId(tagToCategoryId[t])}
              disabled={loading}>
              <Text
                style={[
                  styles.tagText,
                  categoryId === tagToCategoryId[t] && styles.tagTextSelected,
                ]}>
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          style={(styles.input, styles.titleArea)}
          placeholder="제목 입력"
          value={title}
          onChangeText={setTitle}
          editable={!loading}
        />

        <TextInput
          style={[styles.input, styles.contentArea]}
          placeholder="본문 입력"
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
          editable={!loading}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.submitButton, loading && {backgroundColor: '#aaa'}]}
          onPress={handleSubmit}
          disabled={loading}>
          <Text style={styles.submitButtonText}>
            {loading ? '전송중...' : '완료'}
            {/* 전송 결과 콘솔 출력 */}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    backgroundColor: colors.WHITE,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  writeContainer: {
    padding: 24,
    marginBottom: -28,
    gap: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    paddingLeft: 4,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  tagButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.GRAY_400,
    marginRight: 10,
    marginBottom: 10,
  },
  tagButtonSelected: {
    backgroundColor: colors.BLUE_400,
    borderColor: colors.BLUE_400,
  },
  tagText: {
    color: '#333',
    fontSize: 14,
  },
  tagTextSelected: {
    color: 'white',
  },
  input: {
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: colors.GRAY_600,
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
  },
  titleArea: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.BLACK,
    paddingLeft: 8,
  },
  contentArea: {
    height: '60%',
  },
  buttonContainer: {
    alignItems: 'flex-end',
    borderTopWidth: 1,
    marginBottom: 60,
    borderColor: colors.GRAY_400,
    width: '100%',
  },
  submitButton: {
    marginHorizontal: 20,
    paddingVertical: 12,
    width: '20%',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: colors.GREEN,
    fontSize: 16,
  },
});
