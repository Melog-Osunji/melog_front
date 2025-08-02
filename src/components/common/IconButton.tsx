import React, {useState} from 'react';
import {TouchableOpacity, Image, ViewStyle, ImageStyle} from 'react-native';
import {useNavigation, NavigationProp} from '@react-navigation/native';

type IconButtonProps<T extends Record<string, object | undefined>> = {
  imageSource: any;
  pressedImageSource?: any;
  size?: number;
  target?: [keyof T] | [keyof T, T[keyof T]] | 'goBack';
  style?: ViewStyle;
  imageStyle?: ImageStyle;
};

function IconButton<T extends Record<string, object | undefined>>({
  imageSource,
  pressedImageSource,
  size = 32,
  target,
  style,
  imageStyle,
}: IconButtonProps<T>) {
  const navigation = useNavigation<NavigationProp<T>>();
  const [isPressed, setIsPressed] = useState(false);

  const handlePress = () => {
    if (!target) return;

    if (target === 'goBack') {
      navigation.goBack();
      return;
    }

    navigation.navigate(
      ...(target as unknown as Parameters<typeof navigation.navigate>),
    );
  };

  const currentImageSource =
    isPressed && pressedImageSource ? pressedImageSource : imageSource;

  return (
    <TouchableOpacity
      style={style}
      onPress={handlePress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}>
      <Image
        source={currentImageSource}
        style={[{width: size, height: size}, imageStyle]}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
}

export default IconButton;
