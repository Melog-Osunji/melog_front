import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
  Image,
  LayoutChangeEvent,
} from 'react-native';
import {colors} from '@/constants';

export type Option = {label: string; value: string};

type DropdownProps = {
  options: Option[];
  placeholder?: string;
  value?: string | null;
  onChange?: (opt: Option) => void;
  style?: any;
  itemHeight?: number;
};

export default function Dropdown({
  options,
  placeholder = '선택하세요',
  value,
  onChange,
  style,
  itemHeight = 48,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [width, setWidth] = useState<number | undefined>(undefined);
  const selected = options.find(o => o.value === value);

  return (
    <View
      style={[styles.container, style]}
      onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.selector}
        onPress={() => setOpen(v => !v)}>
        <Text style={[styles.label, !selected && styles.placeholder]}>
          {selected?.label ?? placeholder}
        </Text>
        <Image
          source={require('@/assets/icons/common/RightArrow.png')}
          style={[
            {
              width: 24,
              height: 24,
              tintColor: colors.GRAY_400,
              transform: [{rotate: open ? '270deg' : '90deg'}],
            },
          ]}
        />
      </TouchableOpacity>

      {open && (
        <View style={[styles.listInlineWrap, {width: width ?? '100%'}]}>
          <FlatList
            data={options}
            keyExtractor={i => i.value}
            style={{maxHeight: itemHeight * 6}}
            nestedScrollEnabled
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.item}
                activeOpacity={0.7}
                onPress={() => {
                  onChange?.(item);
                  setOpen(false);
                }}>
                <Text style={styles.itemText}>{item.label}</Text>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.sep} />}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {position: 'relative'},
  selector: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.GRAY_200,
    backgroundColor: colors.WHITE,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {fontSize: 16, color: colors.BLACK},
  placeholder: {color: colors.GRAY_400},
  chev: {fontSize: 14, color: colors.GRAY_400},

  listInlineWrap: {
    marginTop: 8,
    backgroundColor: colors.WHITE,
    borderRadius: 8,
    elevation: 6,
    shadowColor: colors.GRAY_200,
    shadowOpacity: 0.08,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 8,
  },

  item: {paddingHorizontal: 16, height: 48, justifyContent: 'center'},
  itemText: {fontSize: 16, color: colors.BLACK},
  sep: {height: 1, backgroundColor: colors.GRAY_100},
});
