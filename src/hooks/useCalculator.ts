import { useState, useCallback } from 'react';
import { Room, Wall, Window, WorkType, defaultWorkTypes } from '@/types/calculator';

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useCalculator = () => {
  const [rooms, setRooms] = useState<Room[]>([]);

  const createRoom = useCallback((name: string = 'Nowy pokój') => {
    const newRoom: Room = {
      id: generateId(),
      name,
      walls: [],
      windows: [],
      workTypes: defaultWorkTypes.map(wt => ({ ...wt, id: generateId() })),
      totalWallArea: 0,
      totalWindowArea: 0,
      netArea: 0,
    };
    setRooms(prev => [...prev, newRoom]);
    return newRoom.id;
  }, []);

  const updateRoomName = useCallback((roomId: string, name: string) => {
    setRooms(prev => prev.map(room => 
      room.id === roomId ? { ...room, name } : room
    ));
  }, []);

  const deleteRoom = useCallback((roomId: string) => {
    setRooms(prev => prev.filter(room => room.id !== roomId));
  }, []);

  const addWall = useCallback((roomId: string, width: number, height: number) => {
    const area = width * height;
    const newWall: Wall = { id: generateId(), width, height, area };
    
    setRooms(prev => prev.map(room => {
      if (room.id !== roomId) return room;
      const walls = [...room.walls, newWall];
      const totalWallArea = walls.reduce((sum, w) => sum + w.area, 0);
      const netArea = totalWallArea - room.totalWindowArea;
      return { ...room, walls, totalWallArea, netArea };
    }));
  }, []);

  const deleteWall = useCallback((roomId: string, wallId: string) => {
    setRooms(prev => prev.map(room => {
      if (room.id !== roomId) return room;
      const walls = room.walls.filter(w => w.id !== wallId);
      const totalWallArea = walls.reduce((sum, w) => sum + w.area, 0);
      const netArea = totalWallArea - room.totalWindowArea;
      return { ...room, walls, totalWallArea, netArea };
    }));
  }, []);

  const addWindow = useCallback((roomId: string, width: number, height: number) => {
    const area = width * height;
    const newWindow: Window = { id: generateId(), width, height, area };
    
    setRooms(prev => prev.map(room => {
      if (room.id !== roomId) return room;
      const windows = [...room.windows, newWindow];
      const totalWindowArea = windows.reduce((sum, w) => sum + w.area, 0);
      const netArea = room.totalWallArea - totalWindowArea;
      return { ...room, windows, totalWindowArea, netArea };
    }));
  }, []);

  const deleteWindow = useCallback((roomId: string, windowId: string) => {
    setRooms(prev => prev.map(room => {
      if (room.id !== roomId) return room;
      const windows = room.windows.filter(w => w.id !== windowId);
      const totalWindowArea = windows.reduce((sum, w) => sum + w.area, 0);
      const netArea = room.totalWallArea - totalWindowArea;
      return { ...room, windows, totalWindowArea, netArea };
    }));
  }, []);

  const updateWorkTypePrice = useCallback((roomId: string, workTypeId: string, price: number) => {
    setRooms(prev => prev.map(room => {
      if (room.id !== roomId) return room;
      const workTypes = room.workTypes.map(wt => 
        wt.id === workTypeId ? { ...wt, pricePerMeter: price } : wt
      );
      return { ...room, workTypes };
    }));
  }, []);

  const toggleWorkType = useCallback((roomId: string, workTypeId: string) => {
    setRooms(prev => prev.map(room => {
      if (room.id !== roomId) return room;
      const workTypes = room.workTypes.map(wt => 
        wt.id === workTypeId ? { ...wt, enabled: !wt.enabled } : wt
      );
      return { ...room, workTypes };
    }));
  }, []);

  const calculateRoomTotal = useCallback((room: Room) => {
    return room.workTypes
      .filter(wt => wt.enabled)
      .reduce((sum, wt) => sum + (room.netArea * wt.pricePerMeter), 0);
  }, []);

  const calculateGrandTotal = useCallback(() => {
    return rooms.reduce((sum, room) => sum + calculateRoomTotal(room), 0);
  }, [rooms, calculateRoomTotal]);

  return {
    rooms,
    createRoom,
    updateRoomName,
    deleteRoom,
    addWall,
    deleteWall,
    addWindow,
    deleteWindow,
    updateWorkTypePrice,
    toggleWorkType,
    calculateRoomTotal,
    calculateGrandTotal,
  };
};
