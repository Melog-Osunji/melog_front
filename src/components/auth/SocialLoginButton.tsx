import React from 'react';
import {
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {SocialProvider, SocialLoginButtonType} from '@/types';

interface SocialLoginButtonProps {
  button: SocialLoginButtonType;
  onPress: (provider: SocialProvider) => void;
  isLoading?: boolean;
  isCurrentLoading?: boolean;
}

const SocialLoginButton = ({
  button,
  onPress,
  isLoading = false,
  isCurrentLoading = false,
}: SocialLoginButtonProps) => {
  const handlePress = () => {
    if (!button.enabled || isLoading) return;
    onPress(button.key);
  };

  const getButtonStyle = () => [
    styles.button,
    {
      backgroundColor: button.backgroundColor,
      borderColor: button.borderColor,
      borderWidth: button.borderColor ? 1 : 0,
    },
    (!button.enabled || isLoading) && styles.buttonDisabled,
  ];

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={button.enabled && !isLoading ? 0.7 : 1}
      style={getButtonStyle()}>
      {isCurrentLoading ? (
        <ActivityIndicator size="small" color={button.textColor} />
      ) : (
        <Image source={button.icon} style={styles.icon} />
      )}

      <Text style={[styles.buttonText, {color: button.textColor}]}>
        {button.text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 32,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginBottom: 16,
    width: '85%',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: 'bold',
    fontFamily: 'NotoSansKR',
    flex: 1,
    textAlign: 'center',
    marginRight: 36, // 아이콘 크기만큼 오른쪽 여백
  },
});

export default SocialLoginButton;
