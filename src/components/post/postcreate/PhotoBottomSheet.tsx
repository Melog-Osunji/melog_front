import React from 'react';
import BottomSheet from '../common/BottomSheet';
import PhotoSelectContent from './PhotoSelectContent';

interface PhotoBottomSheetProps {
  visible: boolean;
  onClose: () => void;
}

export default function PhotoBottomSheet({
  visible,
  onClose,
}: PhotoBottomSheetProps) {
  return (
    <BottomSheet visible={visible} onClose={onClose} height="35%">
      <PhotoSelectContent onClose={onClose} />
    </BottomSheet>
  );
}
