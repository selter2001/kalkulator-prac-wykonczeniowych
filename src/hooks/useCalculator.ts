import { useState, useCallback } from 'react';
import { Room, Wall, Ceiling, WorkType, LinearItem, defaultWorkTypes, VatRate, WorkTypeUnit } from '@/types/calculator';

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useCalculator = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [vatRate, setVatRate] = useState<VatRate>(23);
  const [preparedBy, setPreparedBy] = useState<string>('');

  const createRoom = useCallback((name: string = 'Nowy pokój') => {
    const newRoom: Room = {
      id: generateId(),
      name,
      walls: [],
      ceilings: [],
      workTypes: defaultWorkTypes.map(wt => ({ ...wt, id: generateId() })),
      corners: [],
      grooves: [],
      acrylic: [],
      floorProtection: 0,
      totalWallArea: 0,
      totalCeilingArea: 0,
      totalCorners: 0,
      totalGrooves: 0,
      totalAcrylic: 0,
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

  const addWall = useCallback((roomId: string, area: number) => {
    const newWall: Wall = { id: generateId(), area };
    
    setRooms(prev => prev.map(room => {
      if (room.id !== roomId) return room;
      const walls = [...room.walls, newWall];
      const totalWallArea = walls.reduce((sum, w) => sum + w.area, 0);
      const netArea = totalWallArea + room.totalCeilingArea;
      return { ...room, walls, totalWallArea, netArea };
    }));
  }, []);

  const deleteWall = useCallback((roomId: string, wallId: string) => {
    setRooms(prev => prev.map(room => {
      if (room.id !== roomId) return room;
      const walls = room.walls.filter(w => w.id !== wallId);
      const totalWallArea = walls.reduce((sum, w) => sum + w.area, 0);
      const netArea = totalWallArea + room.totalCeilingArea;
      return { ...room, walls, totalWallArea, netArea };
    }));
  }, []);

  const addCeiling = useCallback((roomId: string, area: number) => {
    const newCeiling: Ceiling = { id: generateId(), area };
    
    setRooms(prev => prev.map(room => {
      if (room.id !== roomId) return room;
      const ceilings = [...room.ceilings, newCeiling];
      const totalCeilingArea = ceilings.reduce((sum, c) => sum + c.area, 0);
      const netArea = room.totalWallArea + totalCeilingArea;
      return { ...room, ceilings, totalCeilingArea, netArea };
    }));
  }, []);

  const deleteCeiling = useCallback((roomId: string, ceilingId: string) => {
    setRooms(prev => prev.map(room => {
      if (room.id !== roomId) return room;
      const ceilings = room.ceilings.filter(c => c.id !== ceilingId);
      const totalCeilingArea = ceilings.reduce((sum, c) => sum + c.area, 0);
      const netArea = room.totalWallArea + totalCeilingArea;
      return { ...room, ceilings, totalCeilingArea, netArea };
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

  const addCustomWorkType = useCallback((roomId: string, name: string, unit: WorkTypeUnit, price: number) => {
    const newWorkType: WorkType = {
      id: generateId(),
      name,
      pricePerMeter: price,
      enabled: true,
      unit,
      isCustom: true,
    };
    
    setRooms(prev => prev.map(room => {
      if (room.id !== roomId) return room;
      return { ...room, workTypes: [...room.workTypes, newWorkType] };
    }));
  }, []);

  const deleteWorkType = useCallback((roomId: string, workTypeId: string) => {
    setRooms(prev => prev.map(room => {
      if (room.id !== roomId) return room;
      const workTypes = room.workTypes.filter(wt => wt.id !== workTypeId);
      return { ...room, workTypes };
    }));
  }, []);

  const addCorner = useCallback((roomId: string, length: number) => {
    const newCorner: LinearItem = { id: generateId(), length };
    setRooms(prev => prev.map(room => {
      if (room.id !== roomId) return room;
      const corners = [...room.corners, newCorner];
      const totalCorners = corners.reduce((sum, c) => sum + c.length, 0);
      return { ...room, corners, totalCorners };
    }));
  }, []);

  const deleteCorner = useCallback((roomId: string, cornerId: string) => {
    setRooms(prev => prev.map(room => {
      if (room.id !== roomId) return room;
      const corners = room.corners.filter(c => c.id !== cornerId);
      const totalCorners = corners.reduce((sum, c) => sum + c.length, 0);
      return { ...room, corners, totalCorners };
    }));
  }, []);

  const addGroove = useCallback((roomId: string, length: number) => {
    const newGroove: LinearItem = { id: generateId(), length };
    setRooms(prev => prev.map(room => {
      if (room.id !== roomId) return room;
      const grooves = [...room.grooves, newGroove];
      const totalGrooves = grooves.reduce((sum, g) => sum + g.length, 0);
      return { ...room, grooves, totalGrooves };
    }));
  }, []);

  const deleteGroove = useCallback((roomId: string, grooveId: string) => {
    setRooms(prev => prev.map(room => {
      if (room.id !== roomId) return room;
      const grooves = room.grooves.filter(g => g.id !== grooveId);
      const totalGrooves = grooves.reduce((sum, g) => sum + g.length, 0);
      return { ...room, grooves, totalGrooves };
    }));
  }, []);

  const addAcrylic = useCallback((roomId: string, length: number) => {
    const newAcrylic: LinearItem = { id: generateId(), length };
    setRooms(prev => prev.map(room => {
      if (room.id !== roomId) return room;
      const acrylic = [...room.acrylic, newAcrylic];
      const totalAcrylic = acrylic.reduce((sum, a) => sum + a.length, 0);
      return { ...room, acrylic, totalAcrylic };
    }));
  }, []);

  const deleteAcrylic = useCallback((roomId: string, acrylicId: string) => {
    setRooms(prev => prev.map(room => {
      if (room.id !== roomId) return room;
      const acrylic = room.acrylic.filter(a => a.id !== acrylicId);
      const totalAcrylic = acrylic.reduce((sum, a) => sum + a.length, 0);
      return { ...room, acrylic, totalAcrylic };
    }));
  }, []);

  const setFloorProtection = useCallback((roomId: string, area: number) => {
    setRooms(prev => prev.map(room => 
      room.id === roomId ? { ...room, floorProtection: area } : room
    ));
  }, []);

  const getWorkTypeQuantity = useCallback((room: Room, workType: WorkType): number => {
    if (workType.unit === 'm2') {
      if (workType.name.includes('Oklejanie')) {
        return room.floorProtection;
      }
      return room.netArea;
    } else {
      // mb - metry bieżące
      if (workType.name.includes('Narożniki')) return room.totalCorners;
      if (workType.name.includes('bruzd')) return room.totalGrooves;
      if (workType.name.includes('Akrylowanie')) return room.totalAcrylic;
      // For custom mb work types, return sum of all linear items
      return room.totalCorners + room.totalGrooves + room.totalAcrylic;
    }
  }, []);

  const calculateRoomTotal = useCallback((room: Room) => {
    return room.workTypes
      .filter(wt => wt.enabled)
      .reduce((sum, wt) => {
        const quantity = getWorkTypeQuantity(room, wt);
        return sum + (quantity * wt.pricePerMeter);
      }, 0);
  }, [getWorkTypeQuantity]);

  const calculateGrandTotal = useCallback(() => {
    return rooms.reduce((sum, room) => sum + calculateRoomTotal(room), 0);
  }, [rooms, calculateRoomTotal]);

  const calculateGrossTotal = useCallback(() => {
    const netTotal = calculateGrandTotal();
    return netTotal * (1 + vatRate / 100);
  }, [calculateGrandTotal, vatRate]);

  return {
    rooms,
    vatRate,
    setVatRate,
    preparedBy,
    setPreparedBy,
    createRoom,
    updateRoomName,
    deleteRoom,
    addWall,
    deleteWall,
    addCeiling,
    deleteCeiling,
    addCorner,
    deleteCorner,
    addGroove,
    deleteGroove,
    addAcrylic,
    deleteAcrylic,
    setFloorProtection,
    updateWorkTypePrice,
    toggleWorkType,
    addCustomWorkType,
    deleteWorkType,
    calculateRoomTotal,
    calculateGrandTotal,
    calculateGrossTotal,
    getWorkTypeQuantity,
  };
};
