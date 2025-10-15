import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {StyleProp, ViewStyle} from 'react-native';

interface Gradient1Props {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

function Gradient1({children, style}: Gradient1Props) {
  return (
    <LinearGradient
      colors={['#08C6D3', '#A0B4E4']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      style={style}>
      {children}
    </LinearGradient>
  );
}

export default Gradient1;
