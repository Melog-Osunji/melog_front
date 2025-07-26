import React, {useState} from 'react';
import {
  Modal,
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
  FlatList
} from 'react-native';

type DropdownItem = {
  label: string;
  onPress: () => void;
  icon?: any;
  color?: string;
};

type DropdownMenuProps = {
  trigger: (open: () => void) => React.ReactNode;
  items: DropdownItem[];
};

export const DropdownMenu = ({trigger, items}: DropdownMenuProps) => {
  const [visible, setVisible] = useState(false);
  const open = () => setVisible(true);
  const close = () => setVisible(false);

  return (
    <>
      {trigger(open)}

      <Modal visible={visible} transparent animationType="fade">
        <TouchableOpacity style={styles.overlay} onPress={close}>
          <View style={styles.menu}>
            {items.map(item => (
              <TouchableOpacity
                key={item.label}
                style={styles.menuItem}
                onPress={() => {
                  item.onPress();
                  close();
                }}>
                {item.icon && <Image source={item.icon} style={styles.icon} />}
                <Text
                  style={[
                    styles.label,
                    item.color ? {color: item.color} : null,
                  ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-end', // 하단에 정렬
  },
  menu: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 8,
    minWidth: 160,
    elevation: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  label: {
    fontSize: 16,
  },
});
