import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {SettingStackParamList} from '@/navigations/stack/SettingStackNavigator';
import {settingsNavigations, colors} from '@/constants';
import SettingHeader from '@/components/settings/SettingHeader';
import InputBox from '@/components/common/InputBox';
import Dropdown, {Option} from '@/components/common/Dropdown';
import CustomButton from '@/components/common/CustomButton';
import {
  ParentType,
  ParentChildMap,
  ParentTitleMap,
  getChildLabel,
} from '@/constants/Support';
import {useCreateInquiry} from '@/hooks/queries/settings/useSettingsMutations';
import {showToast} from '@/components/common/ToastService';

type SupportFormScreenProps = StackScreenProps<
  SettingStackParamList,
  typeof settingsNavigations.SUPPORT_FORM
>;

export default function SupportFormScreen({
  navigation,
  route,
}: SupportFormScreenProps) {
  const parentType: ParentType =
    (route?.params?.type as ParentType) ?? ParentType.ACCOUNT;
  const [contentTitle, setContentTitle] = React.useState('');
  const [content, setContent] = React.useState('');
  const [category, setCategory] = React.useState<string | null>(null);
  const [invaild, setInvaild] = React.useState(true);
  const MAX_LEN = 200;

  const createInquiryMutation = useCreateInquiry();

  useEffect(() => {
    if (category && !(contentTitle.trim().length === 0)) {
      setInvaild(false);
    } else {
      setInvaild(true);
    }
  }, [category, contentTitle]);

  const categories: Option[] = (ParentChildMap[parentType] ?? []).map(ch => ({
    label: getChildLabel(ch),
    value: String(ch),
  }));

  const handleSubmit = React.useCallback(() => {
    if (invaild) return;

    createInquiryMutation.mutate(
      {
        parentType: parentType,
        childType: category as string,
        title: contentTitle,
        content,
      },
      {
        onSuccess: data => {
          navigation.goBack();
          showToast('문의가 성공적으로 제출되었습니다.', 'success');
        },
        onError: err => {
          showToast('문의 등록에 실패했습니다. 다시 시도해주세요.', 'error');
        },
      },
    );
  }, [
    parentType,
    category,
    contentTitle,
    content,
    createInquiryMutation,
    navigation,
    invaild,
  ]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ios: 'padding', android: undefined})}
      keyboardVerticalOffset={Platform.select({ios: 90, android: 0})}>
      <SettingHeader title={ParentTitleMap[parentType]} />
      <ScrollView
        contentContainerStyle={styles.body}
        keyboardShouldPersistTaps="handled">
        {/* 카테고리 */}
        <Dropdown
          options={categories}
          placeholder="카테고리 선택"
          value={category}
          onChange={opt => setCategory(opt.value)}
        />

        {/* 문의 내용 */}
        <InputBox
          value={contentTitle}
          onChangeText={text => {
            if (text.length <= MAX_LEN) setContentTitle(text);
          }}
          multiline
          maxLength={MAX_LEN}
          placeholder="무엇에 대해 문의하시나요?"
        />

        <InputBox
          value={content}
          onChangeText={text => {
            if (text.length <= MAX_LEN) setContent(text);
          }}
          multiline
          maxLength={MAX_LEN}
          placeholder="문의내용을 입력해주세요."
          minHeight={200}
        />

        <Text style={styles.text}>*문의 내용은 수정 및 취소가 불가합니다.</Text>
      </ScrollView>

      <View style={styles.footer}>
        <CustomButton
          label="제출"
          onPress={handleSubmit}
          inValid={invaild}
          variantColor={colors.BLUE_500}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.WHITE},
  body: {paddingHorizontal: 20, paddingVertical: 30, gap: 16},
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    justifyContent: 'center',
  },
  text: {
    fontSize: 12,
    color: colors.GRAY_400,
  },
});
