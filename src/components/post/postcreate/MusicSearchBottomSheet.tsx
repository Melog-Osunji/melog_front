import React from 'react';
import BottomSheet from '@/components/common/BottomSheet';
import MusicSearchContent from './MusicSearchContent';
import {YouTubeVideo} from '@/constants/types';

interface MusicSearchBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onVideoSelect?: (video: YouTubeVideo) => void;
}

export default function MusicSearchBottomSheet({
  visible,
  onClose,
  onVideoSelect,
}: MusicSearchBottomSheetProps) {
  return (
    <BottomSheet visible={visible} onClose={onClose} height="100%">
      <MusicSearchContent onClose={onClose} onVideoSelect={onVideoSelect} />
    </BottomSheet>
  );
}
