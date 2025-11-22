import React, {createContext, useContext, useRef, useState} from 'react';
import {View, StyleSheet} from 'react-native';

type OverlayNode = React.ReactNode;
type Entry = {id: string; node: OverlayNode};
type OverlayContextType = {
  show: (node: OverlayNode) => string;
  hide: (id: string) => void;
  hideAll: () => void;
};

const OverlayContext = createContext<OverlayContextType | null>(null);

export const useOverlay = () => {
  const ctx = useContext(OverlayContext);
  if (!ctx) throw new Error('useOverlay must be used within OverlayProvider');
  return ctx;
};

export const OverlayProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const idRef = useRef(0);

  const show = (node: OverlayNode) => {
    const id = `overlay_${++idRef.current}`;
    setEntries(s => [...s, {id, node}]);
    return id;
  };

  const hide = (id: string) => {
    setEntries(s => s.filter(e => e.id !== id));
  };
  const hideAll = () => {
    console.log('[OverlayProvider] hideAll');
    setEntries([]);
  };

  return (
    <OverlayContext.Provider value={{show, hide, hideAll}}>
      {children}
      {entries.length > 0 && (
        <View pointerEvents="box-none" style={styles.host}>
          {entries.map(e => (
            <View
              key={e.id}
              style={StyleSheet.absoluteFill}
              pointerEvents="box-none">
              {e.node}
            </View>
          ))}
        </View>
      )}
    </OverlayContext.Provider>
  );
};

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
});
