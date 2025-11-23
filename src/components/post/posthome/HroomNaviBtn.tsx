import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {colors} from '@/constants';
import Gradient1 from '@/components/common/styles/gradient1';

interface HarmonyRoom {
  id: string;
  name: string;
  image?: string;
}

interface HaryroomNaviBtnProps {
  rooms: HarmonyRoom[];
  selectedRoomId?: string;
  onRoomSelect?: (roomId: string) => void;
  isLoading?: boolean;
  error?: unknown;
}

function HaryroomNaviBtn({
  rooms,
  selectedRoomId,
  onRoomSelect,
  isLoading,
  error,
}: HaryroomNaviBtnProps) {
  const navigation = useNavigation<any>();

  const handlePress = (roomId: string) => {
    if (onRoomSelect) {
      onRoomSelect(roomId);
      return;
    }
    // 기본 동작: id로 네비게이션
    navigation.navigate('HarmonyRoom' as any, {id: roomId});
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}>
        {isLoading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="small" color={colors.BLUE_400} />
          </View>
        ) : error ? (
          <View style={styles.loadingWrap}>
            <Text style={styles.errorText}>
              하모니룸을 불러오지 못했습니다.
            </Text>
          </View>
        ) : (
          rooms.map(room => (
            <TouchableOpacity
              key={room.id}
              onPress={() => handlePress(room.id)}>
              <Gradient1 style={styles.roomButton}>
                <View
                  style={[
                    styles.profileImage,
                    selectedRoomId === room.id && styles.selectedProfileImage,
                  ]}>
                  {room.image ? (
                    <Image source={{uri: room.image}} style={styles.image} />
                  ) : null}
                </View>
                <Text style={styles.roomText}>{room.name}</Text>
              </Gradient1>
            </TouchableOpacity>
          ))
        )}
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
    paddingRight: 12,
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
  selectedProfileImage: {
    borderWidth: 2,
    borderColor: colors.BLUE_400,
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
  loadingWrap: {
    height: 58,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    color: colors.GRAY_500,
    fontSize: 12,
  },
});

export default HaryroomNaviBtn;
