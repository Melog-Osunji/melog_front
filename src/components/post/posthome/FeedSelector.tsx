import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import BottomSheet from '@/components/common/BottomSheet';
import {colors, defaultFeedTypes} from '@/constants';
import {FeedType} from '@/types';

interface FeedSelectorProps {
  selectedFeed: FeedType;
  onFeedSelect: (feed: FeedType) => void;
}

const FeedSelector: React.FC<FeedSelectorProps> = ({
  selectedFeed,
  onFeedSelect,
}) => {
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

  const handleFeedSelect = (feed: FeedType) => {
    onFeedSelect(feed);
    setIsBottomSheetVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.headerTitle}
        onPress={() => setIsBottomSheetVisible(true)}>
        {/* {selectedFeed.icon && (
          <Image source={selectedFeed.icon} style={styles.selectedIcon} />
        )} */}
        <Text style={styles.headerTitleText}>{selectedFeed.label}</Text>
        <Image
          source={require('@/assets/icons/post/UpArrow.png')}
          style={styles.dropdownIcon}
        />
      </TouchableOpacity>

      {/* Feed Selection BottomSheet */}
      <BottomSheet
        visible={isBottomSheetVisible}
        onClose={() => setIsBottomSheetVisible(false)}
        height="30%">
        <View>
          {defaultFeedTypes.map(feed => (
            <TouchableOpacity
              key={feed.id}
              style={styles.feedOption}
              onPress={() => handleFeedSelect(feed)}>
              {feed.icon && (
                <Image source={feed.icon} style={styles.feedIcon} />
              )}
              <Text style={styles.feedOptionText}>{feed.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </BottomSheet>
    </>
  );
};

const styles = StyleSheet.create({
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.BLACK,
  },
  selectedIcon: {
    width: 20,
    height: 20,
    marginRight: 4,
    resizeMode: 'contain',
  },
  dropdownIcon: {
    width: 24,
    height: 24,
    marginTop: 8,
    transform: [{rotate: '180deg'}],
    marginLeft: 2,
  },
  feedOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  feedOptionText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.BLACK,
  },
  feedIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
    resizeMode: 'contain',
  },
});

export default FeedSelector;
