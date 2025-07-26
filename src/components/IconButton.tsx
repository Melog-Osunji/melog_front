import React, {useState} from 'react';
import {TouchableOpacity, Image} from 'react-native';
import {useNavigation, NavigationProp} from '@react-navigation/native';

type IconButtonProps<T extends Record<string, object | undefined>> = {
  imageSource: any;
  pressedImageSource?: any;
  size?: number;
  target?: [keyof T] | [keyof T, T[keyof T]];
};

function IconButton<T extends Record<string, object | undefined>>({
  imageSource,
  pressedImageSource,
  size = 32,
  target,
}: IconButtonProps<T>) {
  const navigation = useNavigation<NavigationProp<T>>();
  const [isPressed, setIsPressed] = useState(false);

  const handlePress = () => {
    if (!target) return;
    navigation.navigate(
      ...(target as unknown as Parameters<typeof navigation.navigate>),
    );
  };

  const currentImageSource =
    isPressed && pressedImageSource ? pressedImageSource : imageSource;

  return (
    <TouchableOpacity
      onPress={handlePress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}>
      <Image
        source={currentImageSource}
        style={{width: size, height: size}}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
}

export default IconButton;
