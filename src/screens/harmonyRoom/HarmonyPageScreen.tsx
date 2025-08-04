import React from 'react';
import {StyleSheet, Text, View, ScrollView, Image, Dimensions, FlatList} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {HarmonyStackParamList} from '@/navigations/stack/HarmonyStackNavigator';
import styled from 'styled-components/native';
import {colors, harmonyNavigations} from '@/constants';
import IconButton from '@/components/common/IconButton';

const DEVICE_WIDTH = Dimensions.get('window').width;

function HarmonyPageScreen() {
    return (
        <Text>hello</Text>
        );
};

export default HarmonyPageScreen;
