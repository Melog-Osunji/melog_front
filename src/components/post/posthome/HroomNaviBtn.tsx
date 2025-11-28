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
import {colors, maintabNavigations, harmonyNavigations} from '@/constants';
import Gradient1 from '@/components/common/styles/gradient1';
import {useHarmonyRecommendRooms} from '@/hooks/queries/harmonyRoom/useHarmonyRoomGet';

interface HarmonyRoom {
  id: string;
  name: string;
  image?: string;
}

interface HaryroomNaviBtnProps {
  // optional: if parent passes rooms, use them; otherwise component will fetch itself
  rooms?: HarmonyRoom[];
  selectedRoomId?: string;
  onRoomSelect?: (roomId: string) => void;
}

function HaryroomNaviBtn({
  rooms,
  selectedRoomId,
  onRoomSelect,
}: HaryroomNaviBtnProps) {
  const navigation = useNavigation<any>();
  // if parent didn't provide rooms, fetch recommended rooms here
  const {data, isLoading, error} = useHarmonyRecommendRooms();

  const fetchedRooms =
    (data as any)?.recommendedRooms?.map((r: any) => ({
      id: r.id,
      name: r.name ?? r.intro ?? '하모니룸',
      image: r.profileImgLink ?? r.profileImg ?? undefined,
    })) ?? [];

  const displayRooms = rooms && rooms.length > 0 ? rooms : fetchedRooms;

  const handlePress = (roomId: string) => {
    if (onRoomSelect) {
      onRoomSelect(roomId);
      return;
    }

    const pageName = harmonyNavigations.HARMONY_PAGE;
    const stackName = maintabNavigations.MAIN_TAB_HARMONY;

    // 가장 흔한 패턴: 부모(탭/루트)에 스택이 등록되어 있으면 stack -> screen으로 네비게이트
    if (stackName) {
      navigation.getParent?.()?.navigate?.(
        stackName as any,
        {
          screen: pageName,
          params: {roomID: roomId},
        } as any,
      );
      return;
    }

    // 폴백: 직접 페이지로 시도
    try {
      navigation.navigate(pageName as any, {roomID: roomId});
    } catch {
      console.warn(
        '[HroomNaviBtn] navigation failed, page:',
        pageName,
        'stack:',
        stackName,
      );
    }
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
          displayRooms.map((room: HarmonyRoom) => (
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
    backgroundColor: colors.WHITE,
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
