import {useLayoutEffect} from 'react';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {TAB_BAR_STYLE} from '@/navigations/tab/MainTabNavigator';

export function useHideTabBarOnFocus() { //react훅이라 utils에 위치하는게 맞지 않음 나중에 옮길것
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useLayoutEffect(() => {
    if (isFocused) {
      navigation.getParent()?.setOptions({tabBarStyle: {display: 'none'}});
    }
    return () => {
      navigation.getParent()?.setOptions({tabBarStyle: TAB_BAR_STYLE});
    };
  }, [isFocused, navigation]);
}
