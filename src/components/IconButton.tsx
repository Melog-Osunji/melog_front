import React from 'react';
import {TouchableOpacity, Image} from 'react-native';
import {useNavigation, NavigationProp} from '@react-navigation/native';

type IconButtonProps<T extends Record<string, object | undefined>> = {
  imageSource: any;
  size?: number;
  target?: [keyof T] | [keyof T, T[keyof T]];
};

function IconButton<T extends Record<string, object | undefined>>({
  imageSource,
  size = 32,
  target,
}: IconButtonProps<T>) {
  const navigation = useNavigation<NavigationProp<T>>();

  const handlePress = () => {
    if (!target) return;
    navigation.navigate(
      ...(target as unknown as Parameters<typeof navigation.navigate>),
    );
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Image
        source={imageSource}
        style={{width: size, height: size}}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
}

export default IconButton;
