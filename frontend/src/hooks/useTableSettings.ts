// src/hooks/useTableSettings.ts
import { useState } from 'react';

interface TableSettings<T> {
  search: string;
  sort: { key: keyof T; direction: 'asc' | 'desc' } | null;
  page: number;
  isLocked: boolean;
}

export function useTableSettings<T>(key: string, defaultState: TableSettings<T>) {
  const [settings, setSettings] = useState<TableSettings<T>>(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error leyendo settings', e);
    }
    return defaultState;
  });

  // 2. Función para actualizar partes del estado
  const updateSettings = (updates: Partial<TableSettings<T>>) => {
    setSettings((prev) => {
      const newSettings = { ...prev, ...updates };
      
      if (newSettings.isLocked) {
        localStorage.setItem(key, JSON.stringify(newSettings));
      } else {
        localStorage.removeItem(key);
      }
      
      return newSettings;
    });
  };

  return { settings, updateSettings };
}