import { useEffect, useState } from 'react';

/**
 * Hook para persistir datos en localStorage
 * Maneja automáticamente la sincronización entre el estado de React y localStorage
 */

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Inicializar el estado con el valor de localStorage o el valor inicial
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  // Guardar en localStorage cada vez que cambia el valor
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}
