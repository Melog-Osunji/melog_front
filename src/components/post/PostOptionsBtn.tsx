import React from 'react';
import {StyleSheet, Text, TouchableOpacity, ViewStyle} from 'react-native';

type Props = {
	onDelete?: () => void;
	/** Optional override for horizontal offset from the parent's right edge */
	rightOffset?: number;
	style?: ViewStyle;
};

function PostOptionsBtn({onDelete, rightOffset = 0, style}: Props) {
	return (
		<TouchableOpacity
			onPress={onDelete}
			activeOpacity={0.75}
			style={[styles.container, {right: rightOffset}, style]}>
			<Text style={styles.text}>삭제하기</Text>
		</TouchableOpacity>
	);
}

export default PostOptionsBtn;

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: 0,
		right: 0,
		display: 'flex',
		flexDirection: 'row',
		height: 44,
		paddingHorizontal: 16,
		alignItems: 'center',
		// gap isn't supported on all RN versions; emulate with margin
		backgroundColor: '#F2F3F5', // light gray background
		borderRadius: 8,
		// elevation / shadow could be added if desired
	},
	icon: {
		fontSize: 16,
		marginRight: 27, // emulate gap: 27px
	},
	text: {
		fontSize: 14,
		color: '#222',
	},
});

