import {useLayoutEffect, useRef} from 'react';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {TAB_BAR_STYLE} from '@/navigations/tab/MainTabNavigator';

function collectParents(nav: any) {
  const list: any[] = [];
  let p = nav?.getParent?.();
  while (p) {
    list.push(p);
    p = p.getParent?.();
  }
  return list;
}

export function useHideTabBarOnFocus() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const modifiedParentsRef = useRef<any[]>([]);

  useLayoutEffect(() => {
    // 포커스 됐을 때: 모든 조상 중 setOptions 가진 것들에 대해 숨김 적용
    if (isFocused) {
      const parents = collectParents(navigation);
      console.log('[hideTab] parents count:', parents.length);
      parents.forEach((p, i) => {
        const hasSetOptions = typeof p.setOptions === 'function';
        console.log(
          `[hideTab] parent[${i}] hasSetOptions:`,
          hasSetOptions,
          'key/id:',
          p?.id ?? p?.route?.name,
        );
        if (hasSetOptions) {
          try {
            p.setOptions({
              tabBarStyle: {
                ...(TAB_BAR_STYLE ?? {}),
                display: 'none',
                height: 0,
                overflow: 'hidden',
              },
            });
            modifiedParentsRef.current.push(p);
            console.log('[hideTab] setOptions applied to parent index', i);
          } catch (e) {
            console.warn('[hideTab] setOptions failed on parent index', i, e);
          }
        }
      });

      // fallback: 직접 부모(한 단계)에도 시도
      try {
        const directParent = navigation.getParent?.();
        if (
          directParent &&
          !modifiedParentsRef.current.includes(directParent) &&
          typeof directParent.setOptions === 'function'
        ) {
          directParent.setOptions({
            tabBarStyle: {
              ...(TAB_BAR_STYLE ?? {}),
              display: 'none',
              height: 0,
              overflow: 'hidden',
            },
          });
          modifiedParentsRef.current.push(directParent);
          console.log('[hideTab] direct parent setOptions applied as fallback');
        }
      } catch (e) {
        console.warn('[hideTab] fallback directParent setOptions failed', e);
      }

      return;
    }

    // 포커스 해제 / 언마운트: 복원
    return () => {
      const toRestore = modifiedParentsRef.current.splice(0);
      toRestore.forEach((p, i) => {
        try {
          p.setOptions({tabBarStyle: TAB_BAR_STYLE});
          console.log('[hideTab] restored tabBarStyle for parent', i);
        } catch (e) {
          console.warn('[hideTab] restore failed for parent', i, e);
        }
      });
    };
  }, [isFocused, navigation]);
}
