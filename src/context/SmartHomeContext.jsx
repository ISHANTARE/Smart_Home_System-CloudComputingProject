import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { api } from '../utils/api';
import { useAuth } from './AuthContext';

const SmartHomeContext = createContext(null);

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export function SmartHomeProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [rooms, setRooms] = useState({});
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch rooms from backend on auth
  useEffect(() => {
    if (!isAuthenticated) {
      setRooms({});
      setLoading(false);
      return;
    }
    setLoading(true);
    api.getRooms()
      .then((data) => setRooms(data))
      .catch((err) => console.error('Failed to load rooms:', err))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  // ── Toast helpers ──
  const addToast = useCallback((message, type = 'success') => {
    const id = uid();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  // ── Room actions ──
  const addRoom = useCallback(async (roomName) => {
    if (!roomName.trim()) return;
    try {
      await api.addRoom(roomName.trim());
      // re-fetch to get full data
      const data = await api.getRooms();
      setRooms(data);
      addToast(`Room "${roomName}" added`);
    } catch (err) {
      addToast(err.message, 'warning');
    }
  }, [addToast]);

  const removeRoom = useCallback(async (roomName) => {
    const room = rooms[roomName];
    if (!room) return;
    try {
      await api.deleteRoom(room.id);
      setRooms((prev) => {
        const next = { ...prev };
        delete next[roomName];
        return next;
      });
      addToast(`Room "${roomName}" deleted`, 'info');
    } catch (err) {
      addToast(err.message, 'warning');
    }
  }, [rooms, addToast]);

  // ── Device actions ──
  const addDevice = useCallback(async (roomName, device) => {
    const room = rooms[roomName];
    if (!room) return;
    try {
      const newDevice = await api.addDevice({
        roomId: room.id,
        name: device.name || 'New Device',
        icon: device.icon || 'Plug',
        power: device.power || '0Kwh',
      });
      setRooms((prev) => ({
        ...prev,
        [roomName]: {
          ...prev[roomName],
          devices: [...prev[roomName].devices, newDevice],
        },
      }));
      addToast(`"${device.name}" added to ${roomName}`);
    } catch (err) {
      addToast(err.message, 'warning');
    }
  }, [rooms, addToast]);

  const removeDevice = useCallback(async (roomName, deviceId) => {
    try {
      await api.deleteDevice(deviceId);
      setRooms((prev) => ({
        ...prev,
        [roomName]: {
          ...prev[roomName],
          devices: prev[roomName].devices.filter((d) => d.id !== deviceId),
        },
      }));
      addToast('Device removed', 'info');
    } catch (err) {
      addToast(err.message, 'warning');
    }
  }, [addToast]);

  const toggleDevice = useCallback(async (roomName, deviceId) => {
    const room = rooms[roomName];
    if (!room) return;
    const device = room.devices.find((d) => d.id === deviceId);
    if (!device) return;

    // optimistic update
    setRooms((prev) => ({
      ...prev,
      [roomName]: {
        ...prev[roomName],
        devices: prev[roomName].devices.map((d) =>
          d.id === deviceId ? { ...d, isOn: !d.isOn } : d
        ),
      },
    }));

    try {
      await api.updateDevice(deviceId, { isOn: !device.isOn });
    } catch (err) {
      // revert on error
      setRooms((prev) => ({
        ...prev,
        [roomName]: {
          ...prev[roomName],
          devices: prev[roomName].devices.map((d) =>
            d.id === deviceId ? { ...d, isOn: device.isOn } : d
          ),
        },
      }));
    }
  }, [rooms]);

  // ── Light actions ──
  const updateLight = useCallback(async (roomName, lightId, updates) => {
    // optimistic update
    setRooms((prev) => ({
      ...prev,
      [roomName]: {
        ...prev[roomName],
        lights: prev[roomName].lights.map((l) =>
          l.id === lightId ? { ...l, ...updates } : l
        ),
      },
    }));

    try {
      await api.updateLight(lightId, updates);
    } catch (err) {
      console.error('Failed to update light:', err);
    }
  }, []);

  // ── Climate actions ──
  const updateClimate = useCallback(async (roomName, updates) => {
    const room = rooms[roomName];
    if (!room) return;

    setRooms((prev) => ({
      ...prev,
      [roomName]: {
        ...prev[roomName],
        climateDevice: { ...prev[roomName].climateDevice, ...updates },
      },
    }));

    try {
      await api.updateClimate(room.id, updates);
    } catch (err) {
      console.error('Failed to update climate:', err);
    }
  }, [rooms]);

  const value = {
    rooms,
    toasts,
    loading,
    addToast,
    addRoom,
    removeRoom,
    addDevice,
    removeDevice,
    toggleDevice,
    updateLight,
    updateClimate,
  };

  return (
    <SmartHomeContext.Provider value={value}>
      {children}
    </SmartHomeContext.Provider>
  );
}

export function useSmartHome() {
  const ctx = useContext(SmartHomeContext);
  if (!ctx) throw new Error('useSmartHome must be used inside SmartHomeProvider');
  return ctx;
}
