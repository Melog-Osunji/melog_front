import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '@/constants';

interface HarmonyRoom {
  id: string;
  name: string;
  image?: string;
}

interface HaryroomNaviBtnProps {
  rooms: HarmonyRoom[];
  selectedRoomId?: string;
  onRoomSelect: (roomId: string) => void;
}

function HaryroomNaviBtn({
  rooms,
  selectedRoomId,
  onRoomSelect,
}: HaryroomNaviBtnProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}>
        {rooms.map(room => (
          <TouchableOpacity key={room.id} onPress={() => onRoomSelect(room.id)}>
            <LinearGradient
              colors={['#08C6D3', '#A0B4E4']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.roomButton}>
              <View style={styles.profileImage}>
                {room.image && (
                  <Image source={{uri: room.image}} style={styles.image} />
                )}
              </View>
              <Text style={styles.roomText}>{room.name}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 58,
    borderBottomWidth: 1,
    borderBottomColor: '#E3E6ED',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    gap: 8,
    alignItems: 'center',
  },
  roomButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
    borderRadius: 45,
    minWidth: 100,
  },
  profileImage: {
    width: 30,
    height: 30,
    backgroundColor: colors.GRAY_100,
    borderRadius: 15,
    marginRight: 6,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  roomText: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.WHITE,
  },
});

export default HaryroomNaviBtn;
