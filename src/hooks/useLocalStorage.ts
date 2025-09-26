import { useState, useEffect, useCallback } from "react";

interface StorageOptions {
  ttl?: number; // Time to live in milliseconds
}

interface StorageEntry<T> {
  value: T;
  timestamp: number;
  ttl?: number;
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: StorageOptions = {},
): [T, (value: T | ((prevValue: T) => T)) => void, () => void] {
  const { ttl } = options;

  // Get from localStorage
  const getStoredValue = useCallback((): T => {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        const parsedItem: StorageEntry<T> = JSON.parse(item);

        // Check if item has expired
        if (
          parsedItem.ttl &&
          Date.now() > parsedItem.timestamp + parsedItem.ttl
        ) {
          localStorage.removeItem(key);
          return initialValue;
        }

        return parsedItem.value;
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    }
    return initialValue;
  }, [key, initialValue]);

  const [storedValue, setStoredValue] = useState<T>(getStoredValue);

  const setValue = useCallback(
    (value: T | ((prevValue: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        const storageEntry: StorageEntry<T> = {
          value: valueToStore,
          timestamp: Date.now(),
          ttl,
        };

        localStorage.setItem(key, JSON.stringify(storageEntry));
        setStoredValue(valueToStore);
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue, ttl],
  );

  const removeValue = useCallback(() => {
    try {
      localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key) {
        setStoredValue(getStoredValue());
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key, getStoredValue]);

  return [storedValue, setValue, removeValue];
}
