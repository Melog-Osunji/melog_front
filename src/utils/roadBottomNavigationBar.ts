import {useLayoutEffect} from 'react';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {TAB_BAR_STYLE} from '@/navigations/tab/MainTabNavigator';

export function useHideTabBarOnFocus() {
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
