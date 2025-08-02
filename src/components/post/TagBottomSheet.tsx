import React from 'react';
import BottomSheet from '../common/BottomSheet';
import TagSelectContent from './TagSelectContent';

interface TagBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onTagSelect?: (tag: string) => void;
}

export default function TagBottomSheet({
  visible,
  onClose,
  onTagSelect,
}: TagBottomSheetProps) {
  return (
    <BottomSheet visible={visible} onClose={onClose} height="40%">
      <TagSelectContent onClose={onClose} onTagSelect={onTagSelect} />
    </BottomSheet>
  );
}
