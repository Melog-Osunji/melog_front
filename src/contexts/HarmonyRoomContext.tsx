import React, { createContext, useContext, useState } from 'react';
import {harmonyRoomInfo} from '@/api/harmonyRoom/harmonyRoomApi';

type HarmonyRoomContextType = {
  rooms: HarmonyRoomInfo[];
  addRoom: (room: HarmonyRoomInfo) => void;
};

const HarmonyRoomContext = createContext<HarmonyRoomContextType | undefined>(undefined);

export const HarmonyRoomProvider = ({ children }: { children: React.ReactNode }) => {
  const [rooms, setRooms] = useState<HarmonyRoomInfo[]>([]);

  const addRoom = (room: HarmonyRoomInfo) => {
    setRooms(prev => [...prev, room]);
  };

  return (
    <HarmonyRoomContext.Provider value={{ rooms, addRoom }}>
      {children}
    </HarmonyRoomContext.Provider>
  );
};

export const useHarmonyRoomContext = () => {
  const context = useContext(HarmonyRoomContext);
  if (!context) {
    throw new Error('useHarmonyRoomContext must be used within a HarmonyRoomProvider');
  }
  return context;
};
